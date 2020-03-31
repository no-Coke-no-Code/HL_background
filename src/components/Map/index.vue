<template>
  <div>
    <div @click="isShow">
      <slot></slot>
    </div>
    <transition name="map">
      <div class="box" v-show="isShowMap">
        <div class="map-top">
          <div class='map-info'>
            <div>
              当前地址：
              <span style="color: blue" v-if="map.map_pcd == ''">点击地图获取定位</span>
              <span style="color: blue" v-else>{{map.map_province}} {{map.map_city}} {{map.map_district}} {{map.map_street_number}} {{map.map_address}}</span>
            </div>
            <div v-if="map.map_location != ''">
              当前坐标：<span>{{map.map_location}}</span>
            </div>
          </div>
        </div>
        <div class="container" id="container">
          <div class="map_search">
            <input class="map_address_input" ref="mapSearch" placeholder="按下回车键搜索" @keydown.enter="enterSearch()" type="text">
          </div>
          <div class="map_close" @click="closeMap">
            <p>关闭</p>
          </div>
          <div class="map_confirm" @click="confirmMap">确认</div>
        </div>
      </div>
    </transition>
    <transition name="mask">
      <div class="mask" v-show="isShowMap" @click="closeMap"></div>
    </transition>
  </div>
</template>
<script>
export default {
  props: ['address'],
  data() {
    return {
      isShowMap: false,
      map: {
        map_address: '',
        map_pcd:'',     //地图省市区
        map_location: '',
        map_province: '',
        map_city: '',
        map_district: '',
        map_street_number: ''
      },
      center: {}, // 地图中心点
      zoom: 13,  // 图片缩放大小
      citylocation: null,
      getMap: null,  // 获取地图实例
      markersArray: [],  // 标记点数组
      marker: null  // 标记
    }
  },
  
  methods: {
    // 确定
    confirmMap() {
      this.isShowMap = false
      this.$emit('map-confirm', this.map)

      if (this.markersArray) {   // 每次确认清空所有标记
        for (let i in this.markersArray) {
          this.markersArray[i].setMap(null);
        }
      }

    },
    // 关闭
    closeMap() {
      this.isShowMap = false
    },
    
    isShow() {
      this.isShowMap = true;
      this.$emit('is-Show');
      console.log(this.address,'address')
      if(this.address) {
        this.$nextTick(_=>{
          this.getAddress()
        })
      }
    },

    // 初始化地图
    startMap() {
      var self = this;
      this.center = new qq.maps.LatLng(39.916527,116.397128); //获取地图显示容器设置地图中心点

      //定义工厂模式函数
      var myOptions = {
        zoom: this.zoom,               //设置地图缩放级别
        center: this.center,      //设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP  //设置地图样式详情参见MapType
      }
      //获取dom元素添加地图信息
      this.getMap = new qq.maps.Map(document.getElementById("container"), myOptions);
      //获取城市列表接口设置中心点
      this.citylocation = new qq.maps.CityService({
          complete : function(result){
            self.getMap.setCenter(result.detail.latLng);
          }
      });

      this.citylocation.searchLocalCity();  // 定位IP

      qq.maps.event.addListener(self.getMap, 'click', function(event) {  //添加监听事件   获取鼠标单击事件
      
        if (self.markersArray) {  // 每次点击地图清空标记
          for (let i in self.markersArray) {
            self.markersArray[i].setMap(null);
          }
        }

        self.marker=new qq.maps.Marker({  // 添加标记
          position:event.latLng, 
          map: self.getMap
        });

        self.markersArray.push(self.marker);

        var location = self.marker.position.lat + ',' + self.marker.position.lng  // 获取点击是的经纬度
        self.ReverseAddressResolution(location)

      });

    },


    // 逆地址解析  点击获取地址
    ReverseAddressResolution(location) {
      var self = this
      var xhr;
      if (window.XMLHttpRequest) {      // 支持大部分主流浏览器
        xhr = new XMLHttpRequest()
      } else {     // code for IE6, IE5
        xhr = new ActiveXObject(Microsoft.XMLHTTP)
      }

      xhr.onreadystatechange = callback

      xhr.open('get','/apiqq/ws/geocoder/v1/?location='  + location +'&key=3FABZ-2XH6D-AY34E-PVPE7-KOAYO-EHBI7', true)

      xhr.send(null)

      function callback() {
        if(this.readyState === 4 && this.status === 200) {
          var data = JSON.parse(xhr.response)
          console.log(data)
          self.map.map_location =  location;
          self.map.map_pcd = data.result.address;
          self.map.map_address = data.result.formatted_addresses.recommend;
          self.map.map_province = data.result.address_component.province;
          self.map.map_city = data.result.address_component.city;
          self.map.map_district = data.result.address_component.district;
          self.map.map_street_number = data.result.address_component.street_number
        }
      }
    },


    // 回车获取地址
    enterSearch() {
      var iptAddress = this.$refs.mapSearch.value;  // 获取输入框内容
      this.getAddress(iptAddress)
    },
    // 地址解析
    getAddress(iptAddress) {
      var address = ''
      if(iptAddress) {
        address = iptAddress
      } else {
        address = this.address
      }
      
      var self = this
      var xhr;
      if (window.XMLHttpRequest) {      // 支持大部分主流浏览器
        xhr = new XMLHttpRequest()
      } else {     // code for IE6, IE5
        xhr = new ActiveXObject(Microsoft.XMLHTTP)
      }

      xhr.onreadystatechange = callback
      xhr.open('get','/api/ws/geocoder/v1/?address=' + address + '&key=3FABZ-2XH6D-AY34E-PVPE7-KOAYO-EHBI7', true)
      
      xhr.send(null)
      function callback() {
        if(this.readyState === 4 && this.status === 200) {
          var data = JSON.parse(xhr.response)
          console.log(data)
          if(data.status === 0) { // 获取成功时
            self.ent(data.result.location)
          } else if(data.status === 347) {  // 查无此数据
            self.$message({
              message: data.message,
              type: 'warning'
            });
          } else {
            self.$message({
              message: data.message,
              type: 'warning'
            });
          }
          
        }
      }

    },
    ent(searchLocation) {  // 更改输入的经纬度
      var self = this;

      this.center.lat = searchLocation.lat;
      this.center.lng = searchLocation.lng;

      self.getMap.panTo(new qq.maps.LatLng(this.center.lat,this.center.lng));  // 更改中心

      self.marker = new qq.maps.Marker({
        position: this.center,
        map: self.getMap
      });
      self.markersArray.push(self.marker);


      var location = self.marker.position.lat + ',' + self.marker.position.lng  // 获取点击是的经纬度
      self.ReverseAddressResolution(location)
    }

  },
  mounted() {
    this.startMap()
  }
}
</script>

<style lang="scss" scoped>
  .box {
    width: 600px;
    height: 640px;
    background: #f5f5f5;
    text-align: center;
    right: 20px;
    z-index: 99;
    top: 100px;
    position: fixed;

    &.map-enter,
    &.map-leave-to {
      transform: translateX(150%);
    }

    &.map-enter-active,
    &.map-leave-active {
      transition: all .5s;
    }
    &.map-enter-to,
    &.map-leave {
      transform: translateX(0)
    }

    .map-top {
      width: 100%;
      height: 14%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .container{
      position: relative;
      width: 100%;
      height: 86%;

      .map_search {
        position: absolute;
        z-index: 999;
        width: 450px;
        height: 50px;
        top: 10px;
        left: 0;
        right: 0;
        margin: 0 auto;


        .map_address_input {
          width: 360px;
          border: 0;
          border-radius: 6px;
          background-color: white;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          padding-left: 10px;
          padding-right: 10px;
          outline: none;
          box-shadow: 0 0 10px #ccc;
          text-align: center;
        }
      }

      .map_close {
        position: absolute;
        right: 50px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        height: 80px;
        width: 20px;
        background-color: #F56C6C;
        color: #FFF;
        box-shadow: 0 0 10px #999;
        border-radius: 4px;
        z-index: 999;
        user-select: none;
        cursor: pointer;
        & p {
          line-height: 80px;
          white-space: nowrap;
          position: relative;
          z-index: 2;
          font-size: 12px;
          margin-left: 8px;
        }
        &::after{
          content: '';
          display: block;
          width: 0;
          height: 0;
          border-width: 40px 0 40px 40px;
          border-style: solid;
          border-color: transparent transparent transparent #F56C6C;
          position: absolute;
          top: 0px;
          left: 97%;
        }
      }

      .map_confirm {
        position: absolute;
        width: 80px;
        height: 80px;
        line-height: 80px;
        background-color: #409EFF;
        border-radius: 50%;
        z-index: 999;
        bottom: 50px;
        left: 0;
        right: 0;
        margin: 0 auto;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
      }
      .map_confirm:hover {
        background: rgb(104, 176, 248)
      }
    }

  }

  .mask {
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: 9;
      background: rgba(0, 0, 0, .4);
      &.mask-enter,
      &.mask-leave-to {
        background: rgba(0, 0, 0, 0);
      }

      &.mask-enter-active,
      &.mask-leave-active {
        transition: all .5s;
      }
      
      &.mask-enter-to,
      &.mask-leave {
        background: rgba(0, 0, 0, .4);
      }
    }
</style>

