<template>
<div id='rWrap' ref='rWrap'>
    <div id='rScroll' ref='rScroll'>
        <div class="weui-loadmore refresh-wrap" ref='refreshWrap'>
            <span class="weui-loadmore__tips" v-if='isRefresh==1'>下拉刷新</span>
            <span  v-else>
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">加载中…………</span>
            </span>
        </div>
        <slot></slot>
         <div class="weui-loadmore more-wrap" :class="{'weui-loadmore_line':loadEnd,}">
        <i class="weui-loading" v-if='!loadEnd&&isLoad==0'></i>
        <span class="weui-loadmore__tips"  v-text='load_tip' ></span>
    </div>
    </div>
</div>
</template>
<script>
/*  
id: r_wrap 包裹元素；
    r_scroll 内滚动元素

*/

export default {
    props:{
        isRefresh:{
            type:Number,
            default:1//0 正在刷新  1 刷新结束
        },
        isLoad:{
            type:Number,
            degault:1//0 正在加载  1 加载结束
        },
        load_h:{
            type:Number,
            default: 45 //距离底部触发更新的值
        },
        refresh_h:{
            type:Number,
            default: 60 //距离顶部触发刷新的值
        },
        range:{
            type:Number,
            default: 130 // 刷新下拉可以出现的最大空白值
        },
        loadEnd:{ //没有更多数据可以加载
            type:Boolean,
            default:false
        }
    },
    data(){
        return {
            r_state:'',
            l_state:'',
            diff:'',//移动的距离，
            flag:0,// 默认值0 进入刷新域1 进入loadMore域2
        }
    },
    computed:{
        load_tip(){
            if(this.loadEnd){
                return '暂无数据';
            }else if(this.isLoad==0){
                return '正在加载';
            }else {
                return '加载更多';
            }
        }
    },
    watch:{
        'isRefresh':'updateRefresh',
        'isLoad':'updateLoad'
    },
    mounted(){
        this.init();
    },
    methods:{
        updateRefresh(){
            const $page_wrap = this.$refs.rScroll;

            //根据父组件的数据结果，设置refresh的状态
            switch(this.isRefresh){
                case 0:
                     $page_wrap.style.webkitTransform=`translate3d(0,${this.refresh_h}px,0)`;
                     break;
                case 1:
                    $page_wrap.style.webkitTransform='translate3d(0,0,0)';
                    break;
                default:
                     $page_wrap.style.webkitTransform='translate3d(0,0,0)';
            }
        },
        updateLoad(){
            const $page_wrap = this.$refs.rScroll;

            switch(this.isLoad){
                case 0:
                     $page_wrap.style.webkitTransform=`translate3d(0,-${this.load_h}px,0)`;
                     break;
                case 1:
                    $page_wrap.style.webkitTransform='translate3d(0,0,0)';
                    break;
                default:
                     $page_wrap.style.webkitTransform='translate3d(0,0,0)';
            }
        },
        init(){
            //注册touch事件
            /*思路
                1. 如果滚动到底部能看见loadMore了，松手就加载更多
                2. 下拉刷新，设置一个下拉的临界点，超过这个临界点就刷新页面，没有超过临界点松手回弹。
                3. 向外暴露刷新跟加载更多的接口
                4. 父组件返回刷新、加载更多结果
            */
            const $page = this.$refs.rWrap;
            const $page_wrap = this.$refs.rScroll;
            const $refresh_wrap = this.$refs.refreshWrap;
            const $win_h = window.innerHeight;
           
            var pageNow = 1;
            var vm = this;
            var _data={}; //存放私有变量
            $page.addEventListener('touchstart',(e)=>{
                e=e.changedTouches ? e.changedTouches[0]:e;  
                _data.startY = e.clientY;
            });
            $page.addEventListener('touchmove',(e)=>{
                let _e=e.changedTouches ? e.changedTouches[0]:e;
                let Y = _e.clientY;
                let $page_h = $page.scrollHeight;
                let isBottom = $page_h -$page.scrollTop-$win_h<=vm.load_h;
                let d =  (Y-_data.startY);
                let rate = d/$win_h;
                vm.diff = _data.diff = rate*vm.range;
                if(_data.diff>0&&$page.scrollTop==0) {
                    //刷新
                   
                    vm.flag=1;//进入刷新域
                     $page_wrap.style.webkitTransform=`translate3d(0,${vm.diff}px,0)`;                    
                    e.preventDefault();
                }else if(_data.diff<0&&isBottom&&!vm.loadEnd){
                    //加载更多
                    vm.flag=2;
                    $page_wrap.style.webkitTransform=`translate3d(0,${vm.diff}px,0)`;    
                }
            });
            $page.addEventListener('touchend',(e)=>{
                e=e.changedTouches ? e.changedTouches[0]:e;
                _data.endY = e.clientY;          
                let $page_h = $page.scrollHeight;
                let isBottom = $page_h -$page.scrollTop-$win_h-vm.load_h<=0;
             
                //下拉刷新
                if(vm.flag ==1) {
                    vm.flag=0;
                    if(_data.diff&&_data.diff>0) {
                        if(_data.diff>=vm.refresh_h) {
                            //到达阀域，刷新
                            if(vm.isRefresh!=0){
                                $page_wrap.style.webkitTransform=`translate3d(0,${vm.refresh_h}px,0)`;
                                vm.$emit('to-refresh');
                            }
                        }else {
                            $page_wrap.style.webkitTransform='translate3d(0,0,0)';
                        }
                    }
                }
                if(vm.flag==2){
                    vm.flag=0;
                    let diff = _data.endY-_data.startY;
                    
                    if(Math.abs(diff)>=vm.load_h) {
                        //到达阀域，加载更多
                        if(vm.isLoad!=0){
                            $page_wrap.style.webkitTransform=`translate3d(0,-${vm.load_h}px,0)`;
                            vm.$emit('to-load');
                        }
                    }else {
                        $page_wrap.style.webkitTransform='translate3d(0,0,0)';
                    }
                    
                }
                _data.startY=null;
            });
            
            }
        }
}
</script>
<style>
#rWrap {    position: absolute;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;}
.refresh-wrap {margin-top: -44px;}
#rScroll {position: relative;padding-bottom: 45px;}
#rScroll .more-wrap{position: absolute;width: 100%;left: 0;bottom: -25px;}
</style>