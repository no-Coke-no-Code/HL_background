import { debounce } from '@/utils'
import { mapGetters } from 'vuex' 

export default {
    computed: {
        ...mapGetters({
            menuSlider: 'menuSlider'
        })
    },
    watch: {
        "menuSlider.opened": {
            handler(newVal, oldVal) {
                debounce(() => {
                    this.$emit('resize')
                }, 300)()
            },
            deep: true
        }
    }
}