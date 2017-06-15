<template>
	  <refresh-more :is-refresh='isRefresh' :is-load='isLoad' :load-end='loadEnd' @to-refresh='toRefresh' @to-load='toLoad'>
        <ul class='list'>
            <li v-for='li in list'>当前列表{{li}}</li>
        </ul>
      </refresh-more>
</template>
<style lang="scss">
.list li{padding: 10px 20px; border-bottom: 1px solid #eee;}

</style>
<script>

const refreshMore = r => require.ensure([], () => r(require("components/refresh&loadMore")), 'refresh');
  	export default {
        components:{
            refreshMore
        },
    	data(){
            return {
                list:20,
                loaded:false,
                pageNow:1,
                isRefresh:1,//0 正在刷新  1 刷新结束
                isLoad:1,//0 正在加载更多 1 加载更多结束
                loadEnd:false
            }
        },
        methods:{
            toRefresh(){
                this.isRefresh=0;
                setTimeout(()=>{
                    this.list=20;
                    console.log('1')
                    this.isRefresh = 1;
                },2000)
            },
            toLoad(){
               this.isLoad=0;
               setTimeout(()=>{
                   if(this.list<200){
                      this.list+=10;
                     
                   }else {
                       this.loadEnd=true;
                   }
                    this.isLoad = 1;
                },2000)
            },
        }
  	}

</script>

