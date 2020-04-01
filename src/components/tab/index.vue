<template>
    <div class="tabWrapper" >
        <div class="block" v-if="type === 'block'">
            <div class="tab">
                <div v-for="(item,index) in tabList" :key="index" @click="chooseItem(item,index)" class="tabItem" :class="{'activeItem':activeIndex===index}">
                    <span>{{item.label}}</span>
                    <span>({{item.count}})</span>
                </div>
            </div>
        </div>

        <div class="bar" v-if="type === 'bar'">
            <div class="tab">
                <div v-for="(item,index) in tabList" :key="index" @click="chooseItem(item,index)" class="tabItem" :class="{'activeItem':activeIndex===index}">
                    <span>{{item.label}}</span>
                    <span>({{item.count}})</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:"tab",
    data(){
    return{
            activeIndex:0,
        }
    },
    props: {
        // 列表
        tabList : {
            type: Array,
            default() {
                return [];
            }
        },

        // 列表类型
        type : {
            type:String,
            default(){
                return "block";
            },
        }
    },
    methods:{
        chooseItem(item,index){
            this.activeIndex = index;
            this.$emit('selectChange',item);
        },
    },
    watch:{
        tabList(val){
            console.log(val);
        },
    },
}
</script>
<style lang="scss" scoped>
    .tabWrapper
    {
        font-size: 12px;
        display: flex;
        .block
        {
            .tab
            {
                cursor: pointer;
                border-radius: 15px;
                display: -webkit-box;
                overflow: auto;  
                height: 30px;
                background-color: #f5f5f5;
                .tabItem
                {
                    border-radius: 15px;
                    width: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: none;
                    &:hover
                    {
                        color: #409EFF;
                        transition: .3s ease;
                    }
                }
                .activeItem
                {
                    color: #fff;
                    background-color: #409EFF;
                    &:hover
                    {
                        color: #fff;
                    }
                }
            }
        }

        .bar
        {
            .tab
            {
                display: -webkit-box;
                overflow: auto;  
                .longTabItem,.tabItem
                {
                    width: 100px;;
                    display: flex;
                    min-height: 40px;
                    justify-content: center;
                    align-items: center;
                }
                .activeItem
                {
                    border-bottom: 2px solid #409EFF;
                    color: #409EFF;
                }
            }
            .longTab
            {
                display: flex;
                align-items: center;
            }
        }
    }
</style>