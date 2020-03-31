<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分页例子</span>
      </div>
      <pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10,20]"
        :current-page="currentPage"
        :total="100"
      >
        <div>我是分页</div>
      </pagination>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>查看大图</span>
      </div>
      <img
        class="img"
        v-for="(img,index) in imgList"
        :src="img"
        :key="index"
        alt
        @click="bigPictureClick(img,index)"
      >

      <!-- <big-picture-a
        :images="imgList"
        :visible.sync="bigPictureVisible"
        :imagesIndex="bigPictureIndex"
      />-->
      <big-Picture
        :images="imgList"
        :visible.sync="bigPictureVisible"
        :imagesIndex="bigPictureIndex"
      ></big-Picture>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作区</span>
      </div>
      <operating-area showBtn="delete,export,setting" @on-click="operatingAreaClick">
      </operating-area>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作区2</span>
      </div>
      <search-area :SearchOptions="search" @on-change="searchChange">
        <searchOptions :SearchOptions="search" on-confirm="confirmSearch"></searchOptions>
      </search-area>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作区2</span>
      </div>
      <search-area :SearchOptions="search" @on-change="searchChange">
        <searchOptions :SearchOptions="search" on-confirm="confirmSearch"></searchOptions>
      </search-area>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>操作区2</span>
      </div>
      <search-area :SearchOptions="search" @on-change="searchChange">
        <searchOptions :SearchOptions="search" on-confirm="confirmSearch"></searchOptions>
      </search-area>
    </el-card>
  </div>
</template>


<script>
import bigPicture from "@/components/BigPicture";
import operatingArea from "@/components/OperatingArea";
import pagination from "@/components/Pagination";
import searchArea from "@/components/SearchArea";
import searchOptions from "@/components/SearchOptions";
export default {
  components: {
    bigPicture,
    operatingArea,
    pagination,
    searchArea,
    searchOptions
  },
  data() {
    return {
      b: 1,
      treeList: [
        {
          label: 1,
          child: [
            {
              label: "1-1",
              child: [
                {
                  label: "1-1-1",
                  child: [
                    {
                      label: "1-1-1-1"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      currentPage: 4,
      imgList: [
        "http://bpic.588ku.com/illus_water_img/19/03/10/31fbc21deab7dfbc4acd243cde4add0f.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/19/7ce92155ea45dea244cbeff80b3c488d.jpg",
        "http://bpic.588ku.com//back_water_img/19/01/30/112d3d94117c184bb4d077c0016babac92.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/10/31fbc21deab7dfbc4acd243cde4add0f.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/19/7ce92155ea45dea244cbeff80b3c488d.jpg",
        "http://bpic.588ku.com//back_water_img/19/01/30/112d3d94117c184bb4d077c0016babac92.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/10/31fbc21deab7dfbc4acd243cde4add0f.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/19/7ce92155ea45dea244cbeff80b3c488d.jpg",
        "http://bpic.588ku.com//back_water_img/19/01/30/112d3d94117c184bb4d077c0016babac92.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/10/31fbc21deab7dfbc4acd243cde4add0f.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/19/7ce92155ea45dea244cbeff80b3c488d.jpg",
        "http://bpic.588ku.com//back_water_img/19/01/30/112d3d94117c184bb4d077c0016babac92.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/10/31fbc21deab7dfbc4acd243cde4add0f.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/19/7ce92155ea45dea244cbeff80b3c488d.jpg",
        "http://bpic.588ku.com/illus_water_img/19/03/19/7ce92155ea45dea244cbeff80b3c488d.jpg"
      ],
      bigPictureVisible: false,
      bigPictureIndex: 0,

      search: [
        {
          label: "处理时间区间",
          value: {
            start: "",
            end: ""
          },
          placeholder: "处理时间区间",
          type: "startEndDate",
          isDefaultDate: true
        },
        {
          label: "姓名1",
          value: "",
          placeholder: "姓名2",
          type: "input"
        },
        {
          label: "姓名2",
          value: "",
          placeholder: "姓名2",
          type: "input"
        },
        {
          label: "姓名3",
          value: "",
          placeholder: "姓名3",
          type: "input"
        },
        {
          label: "姓名4",
          value: "",
          placeholder: "姓名4",
          type: "input"
        },
        {
          label: "姓名5",
          value: "",
          placeholder: "姓名5",
          type: "input"
        },
        {
          label: "授权代理号",
          value: "",
          placeholder: "姓名",
          type: "input"
        },
        {
          label: "处理时间区间1",
          value: {
            start: "",
            end: ""
          },
          placeholder: "处理时间区间1",
          type: "startEndDate"
        },
        {
          label: "状态",
          value: -1,
          placeholder: "请选择",
          type: "select",
          options: [
            {
              label: "所有",
              value: -1
            },
            {
              label: "使用",
              value: 1
            },
            {
              label: "未使用",
              value: 2
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.search.forEach((item, index) => {
      item.order = index;
    });
  },
  methods: {
    change() {
      this.b += 1;
      this.change_test(this.b);
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    bigPictureClick(img, index) {
      console.log("bigPictureClick", index);
      this.bigPictureVisible = true;
      this.bigPictureIndex = index;
    },

    operatingAreaClick(type) {
      console.log(type);
    },

    confirmSearch() {},

    searchChange(obj) {
      this.search = obj;
    }
  }
};
</script>
<style lang="scss" scoped>
.img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  border-radius: 2px;
  cursor: pointer;
}

.label {
  display: inline-block;
  padding: 0 10px;
  text-align: right;
  padding-right: 6px;
  font-size: 14px;
}
.btn-wrapper {
  padding: 0 20px;
}
</style>

