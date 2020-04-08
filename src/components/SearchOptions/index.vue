<template>
  <div class="search_box">
    <div v-for="(item,index) in search" :key="index">
        <div class="flex align-center mb10" style="min-width: 280px" v-if="item.type === 'input'">
          <!-- input -->
          <label class="label">{{item.label}}</label>
          <el-input
            class="flex-item"
            v-model="item.value"
            :placeholder="item.placeholder"
            :maxlength="item.max || 30"
          ></el-input>
        </div>
        <div class="flex align-center mb10" style="min-width: 560px" v-if="item.type === 'startEndDate'">
          <!-- date-picker -->
          <label class="label">{{item.label}}</label>
          <div class="flex flex-item align-center">
            <el-date-picker
              v-model="item.value.start"
              type="date"
              @change="startTimeChange(item)"
              placeholder="选择开始日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <span style="margin: 0 6px;color: #999;">-</span>
            <el-date-picker
              v-model="item.value.end"
              type="date"
              @change="endTimeChange(item)"
              placeholder="选择结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
        </div>
        <div
          class="flex align-center mb10"
          style="min-width: 310px"
          v-if="item.type === 'select'"
        >
          <!-- select -->
          <label class="label">{{item.label}}</label>
          <el-select v-model="item.value" :placeholder="item.placeholder" @change="selectionChange(item)">
            <el-option
              v-for="item in item.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="flex align-center mb10" style="min-width: 320px" v-if="item.type === 'date'">
          <!-- date -->
          <label class="label">{{item.label}}</label>
          <el-date-picker value-format="yyyy-MM-dd" v-model="item.value" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <!-- 区省市选择器 -->
        <div class="flex align-center mb10" style="min-width: 320px" v-if="item.type === 'regionSelect'">
          <label class="label">{{item.label}}</label>
          <el-select v-model="chosenArea" placeholder="选择区域" @change="regionChange(1)" style="width:100px;margin-right:5px">
            <el-option
              v-for="item in areaList"
              :key="item.Id"
              :label="item.AreaName"
              :value="item.Id"
            ></el-option>
          </el-select>
          <el-select v-model="chosenProvince" placeholder="选择省" @change="regionChange(2)" style="width:100px;margin-right:5px">
            <el-option
              v-for="item in provinceList"
              :key="item.Id"
              :label="item.ProvinceName"
              :value="item.Id"
            ></el-option>
          </el-select>
          <el-select v-model="chosenCity" placeholder="选择市" @change="regionChange(3)" style="width:100px">
            <el-option
              v-for="item in cityList"
              :key="item.Id"
              :label="item.CityName"
              :value="item.Id"
            ></el-option>
          </el-select>
        </div>
    </div>

    <div class="btn-wrapper">
      <el-button type="primary" @click="confirmSearch">{{searchButtonText}}</el-button>
      <!-- <el-button plain v-if="resetable" @click="resetSearch">{{resetButtonText}}</el-button> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 搜索选项
    SearchOptions: {
      type: Array,
      default() {
        return [];
      }
    },
    searchButtonText: {
      type: String,
      default: '搜索'
    },
    resetButtonText: {
      type: String,
      default: '重置'
    },
    resetable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      search: [],

      areaList:[],
      provinceList:[],
      cityList:[],

      chosenArea:"",
      chosenProvince:"",
      chosenCity:"",
    };
  },
  watch: {
    SearchOptions: {
      handler(n, o) {
        this.search = this.SearchOptions;
        this.search.forEach(item => {
          if (item.type === "startEndDate" && item.isDefaultDate) {
            this.startTimeChange(item);
          }

          // 如果存在区省市选择器，则需要先读取大区的列表
          if(item.type === "regionSelect")
          {
            if(!this.areaList.length)
            {
              this.$http.PcArea
              .GetListAreaAsyncCtl()
              .then((res)=>{
                console.log(res);
                this.areaList = JSON.parse(JSON.stringify(res));
              })
              .catch((err)=>{
                console.log(err);
              });
            }
          }
        });
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 省市区选择器改变事件
    regionChange(val){
      // 区域值发生改变
      if(val === 1)
      {
        this.cityList = [];
        this.chosenProvince = "";
        this.chosenCity = "";
        let sendObj = {
          areaId:this.chosenArea,
        };
        this.$http.PcArea
        .GetListProvinceAsyncCtl(sendObj)
        .then((res)=>{
          this.provinceList = JSON.parse(JSON.stringify(res));
        })
        .catch((err)=>{
          console.log(err);
        });
        this.$emit("regionChange",this.chosenArea,this.chosenProvince,this.chosenCity);
      }
      // 省值发生改变
      else if(val === 2)
      {
        this.cityList = [];
        this.chosenCity = "";
        let sendObj = {
          provinceId:this.chosenProvince,
        };
        this.$http.PcArea
        .GetListCityAsyncCtl(sendObj)
        .then((res)=>{
          this.cityList = JSON.parse(JSON.stringify(res));
        })
        .catch((err)=>{
          console.log(err);
        });
        this.$emit("regionChange",this.chosenArea,this.chosenProvince,this.chosenCity);
      }
      // 市值发生改变
      else if(val === 3)
      {
        this.$emit("regionChange",this.chosenArea,this.chosenProvince,this.chosenCity);
      }
    },

    // 级联选择器改变事件
    selectionChange(item){
      console.log(item);
      if(item.label === "所属系统")
      {
        this.$emit("select-change",item);
      }
    },
    // 搜索
    confirmSearch() {
      var result = {} 
      this.search.forEach((item, index) => {
        item.key !== '' ? result[`${item.key}`] = item.value : result[`key-${index}`] = item.value
      })
      console.log(result);

      this.$emit("on-confirm", result);
    },
    // 重置
    resetSearch() {
      this.search = this.search.map((item, index) => {
        if (item.type === "startEndDate" && item.isDefaultDate) {
          this.startTimeChange(item);
        } 
        else {
          item.value = ""
        }
        return item
      })
      this.$emit("on-reset", this.search)
    },
    // 开始时间处理
    startTimeChange(item) {
      console.log(item);
      if (!item.value.start) {
        item.value.start = this.formatDate(new Date(), "yyyy-MM-dd");
      }
      if (item.value.end) {
        var startTimes = new Date(item.value.start);
        var endTimes = new Date(item.value.end);
        if (startTimes > endTimes) {
          this.$message({
            type: "warning",
            message: "开始时间不能大于结束时间",
            showClose: true
          });
          item.value.end = "";
        }
      }
    },
    // 结束时间处理
    endTimeChange(item) {
      console.log(item);
      if (!item.value.start) {
        this.$message({
          type: "warning",
          message: "还没选择开始时间",
          showClose: true
        });
        item.value.end = "";
      } else {
        var startTimes = new Date(item.value.start);
        var endTimes = new Date(item.value.end);
        if (endTimes < startTimes) {
          this.$message({
            type: "warning",
            message: "结束时间不能小于开始时间",
            showClose: true
          });
          item.value.end = "";
        }
      }
    },
    // 格式化时间
    formatDate(date, fmt) {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() - 1 + "").substr(4 - RegExp.$1.length)
        );
      }

      let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": 0,
        "m+": 0,
        "s+": 0
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + "";
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
          );
        }
      }
      return fmt;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/mixin.scss";
.mb10 {
  margin-bottom: 10px;
}
.search_box {
  border-bottom: 2px solid #cccccc;
  padding-bottom: 10px;
  margin-bottom: 20px;
  > div {
    display: inline-block;
    vertical-align: top;
  }
}
.label {
  display: inline-block;
  padding: 0 10px;
  text-align: right;
  padding-right: 6px;
  font-size: 12px;
  width: auto;
}
.btn-wrapper {
  padding: 0 20px;
  display: inline-block;
}
</style>
