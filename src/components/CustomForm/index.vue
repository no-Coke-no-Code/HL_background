<template>
  <div class="formWrapper">
    <el-form :label-width="labelWidth">
      <template v-for="(item, index) in formData">
        <!-- 有插槽 -->
        <el-form-item
          :key="index"
          :label="item.label"
          :prop="item.key"
          :id="item.key"
          v-if="item.slotName"
        >
          <div slot="label">
            <span v-if="item.required" class="red">*</span>
            {{item.label}}
          </div>
          <slot :name="item.slotName" :data.sync="item"></slot>
        </el-form-item>

        <!--  默认 -->
        <el-form-item :key="index" :label="item.label" :prop="item.key" :id="item.key" v-else>
          <div slot="label">
            <span v-if="item.required" class="red">*</span>
            {{item.label}}
          </div>
          <!-- 输入框 -->
          <el-input
            v-model="item.value"
            v-if="item.type === 'input'"
            :placeholder="item.placeholder"
            :disabled="item.disabled"
          ></el-input>
          <!-- 选择框 -->
          <el-select
            v-model="item.value"
            :placeholder="item.placeholder"
            v-if="item.type === 'select'"
            :disabled="item.disabled"
            @change="selectionChange(item)"
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
          <!-- 单选框 -->
          <span v-if="item.type === 'radio'">
            <el-radio
              v-model="item.value"
              v-for="option in item.options"
              :key="option.value"
              :label="option.value"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
            >{{option.label}}</el-radio>
          </span>

          <!-- cascader -->
          <el-cascader
            v-if="item.type === 'cascader'"
            :options="item.options"
            v-model="item.value"
            :disabled="item.disabled"
            :placeholder="item.placeholder"
          ></el-cascader>
          <!-- cascader -->

          <!-- textarea -->
          <el-input
            v-model="item.value"
            v-if="item.type === 'textarea'"
            :placeholder="item.placeholder"
            type="textarea"
            :disabled="item.disabled"
          ></el-input>

          <!-- switch -->
          <div class="switch-wrapper" v-if="item.type === 'switch'">
            <el-switch v-model="item.value"></el-switch>
            <span class="switch-state">{{item.value?'开业':'停业'}}</span>
            <p class="switch-tips">{{item.tipsInline}}</p>
          </div>

          <!-- date picker -->
          <el-date-picker
            v-model="item.value"
            v-if="item.type === 'date'"
            placeholder="选择日期">
          </el-date-picker>

          <!-- time picker -->
          <el-time-picker
            is-range
            v-model="item.value"
            v-if="item.type === 'time'"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>

          <!-- 提示 -->
          <div class="tip" v-if="item.tip">{{item.tip}}</div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CustomForm",
  props: {
    // 设置label的宽度
    labelWidth: {
      type: String,
      default: "130px"
    },
    formData: {
      type: Array,
      default: []
    }
  },
  methods: {
    selectionChange(item){
      this.$emit("select-change",item);
    },
    // 处理必填的提示
    handlerCustomFormRequired() {
      var isTrue = true;
      for (let i in this.formData) {
        if (this.formData[i].required) {
          let type = typeof this.formData[i].value;
          if (type === "object" && this.formData[i].value.length) {
            for (let v in this.formData[i].value) {
              if (Object.keys(this.formData[i].value[v]).includes("value")) {
                if (!this.formData[i].value[v].value) {
                  let tip =
                    (this.formData[i].type === "upload" && "还没上传!") ||
                    "为必填项!";
                  this.$message.warning(this.formData[i].value[v].label + tip);
                  isTrue = false;
                  break;
                }
              }
            }
          } else if (type === "object" && !this.formData[i].value.length) {
            this.$message.warning(this.formData[i].label + "为必填项");
            isTrue = false;
            break;
          } else if (type === "string" || type === "number") {
            if (this.formData[i].value === "") {
              console.log(this.formData[i].label);
              this.$message.warning(this.formData[i].label + "为必填项");
              isTrue = false;
              break;
            }
            // 补充校验手机号的规则 
            else if(this.formData[i].validType && this.formData[i].validType ==='phone')
            {
              let format = /^1[3456789]\d{9}$/;
              if(!format.test(this.formData[i].value))
              {
                this.$message({
                  type:"warning",
                  message:"请输入正规的手机号码"
                });
                isTrue = false;
                break
              }
              // 补充身份证的规则
              else if(this.formData[i].validType && this.formData[i].validType === 'idCard')
              {
                let format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/
                if(!format.test(this.formData[i].value))
                {
                  this.$message({
                    type:"warning",
                    message:"请输入正规的身份证"
                  });
                  isTrue = false;
                  break
                }
              }
            }
          }
        }
      }
      if (isTrue) {
        var result = {};
        this.formData.forEach((item, index) => {
          var val = item.value;
          if(item.valueType === "Number") {
            val = Number(item.value)
          }
          item.key !== ""
            ? (result[`${item.key}`] = val)
            : (result[`key-${index}`] = val);
        });
        return result;
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.formWrapper {
  max-height: 510px;
  overflow: auto;
  /deep/ .el-form-item__label,
  /deep/ .el-input__inner,
  /deep/.el-form-item__content {
    font-size: 12px;
  }
  /deep/ .el-date-editor.el-input,
  /deep/ .el-date-editor--timerange.el-input__inner {
    width: 100%;
  }
}
.red {
  color: red;
}
.tip {
  font-size: 12px;
  color: #999999;
}
.red
{
  color: red;
}

/deep/.el-select,
/deep/.el-cascader {
  width: 100%;
}

.switch-wrapper {
  display: flex;
  align-items: center;
  .switch-state {
    margin-left: 10px;
  }
  .switch-tips {
    margin-left: 20px;
  }
}
</style>
