export default {
    data() {
        return {
            mainHeight: 200,
            CalculateTableHeightTimer: null
        }
    },
    mounted() {
        this.CalculateTableHeight()
        // 视窗变化时重新计算
        window.addEventListener("resize", () => {
            this.CalculateTableHeight()
        })
        // 监听菜单收缩
        this.bus.$on('toggleMenu', () => {
            this.CalculateTableHeight()
        })
    },
    methods: {
        CalculateTableHeight() {
            if (this.CalculateTableHeightTimer) {
                clearTimeout(this.CalculateTableHeightTimer)
                this.CalculateTableHeightTimer = null
            }
            this.CalculateTableHeightTimer = setTimeout(() => {
                var topH = 0, paginationH = 0
                
                if (this.$refs.topBox) topH = this.$refs.topBox.getBoundingClientRect().height
                if (this.$refs.paginationBox) paginationH = this.$refs.paginationBox.getBoundingClientRect().height 
                this.mainHeight = this.$el.getBoundingClientRect().height  - topH - paginationH
            }, 300)
        }
    },
    beforeDestroy() {
        clearTimeout(this.M_conputeTableHeightTimer)
        this.M_conputeTableHeightTimer = null
        window.removeEventListener("resize", () => { });
    }
}