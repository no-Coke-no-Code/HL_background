// 定义一个混入对象
export const CalculateHeight = {
  data() {
    
    return {
      mainHeight: 300,
      M_conputeTableHeightTimer: null
    }
  },
  watch: {
  },
  computed: {
    mainSty() {
      return "height: " + this.mainHeight + "px";
    }
  },
  mounted() {
    this.M_init()
  },
  methods: {
    M_init() {
      this.M_conputeTableHeight();

      this.bus.$on('toggleMenu', _ => {
        this.M_conputeTableHeight();
      })
      window.addEventListener("resize", _ => {
        this.M_conputeTableHeight();
      });
    },
    // 计算高度
    M_conputeTableHeight() {
      if (this.M_conputeTableHeightTimer) {
        clearTimeout(this.M_conputeTableHeightTimer)
      }
      this.M_conputeTableHeightTimer = setTimeout(_ => {
        var topH = 0, paginationH = 0
        if (this.$refs.topBox) topH = this.$refs.topBox.getBoundingClientRect().height
        if (this.$refs.paginationBox) paginationH = this.$refs.paginationBox.getBoundingClientRect().height
        this.mainHeight = this.$el.getBoundingClientRect().height - topH - paginationH;
      }, 300)
      console.log(this.mainHeight)
    }
  },
  beforeDestroy() {
    clearTimeout(this.M_conputeTableHeightTimer)
    window.removeEventListener("resize", _ => { });
  }

}
