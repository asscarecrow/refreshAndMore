# 基于vue2.0 的h5 下拉刷新上拉加载更多二合一组件

## 组件实现思路
1. 如果滚动到底部能看见loadMore了，松手就加载更多
2. 下拉刷新，设置一个下拉的临界点[load_h]，超过这个临界点就刷新页面，没有超过临界点松手则回弹。
3. 向外暴露刷新跟加载更多的接口
4. 由父组件回传刷新、加载更多状态结果isRefresh、isLoad、isLoadEnd

## 组件属性说明

| Property      | Type          | Default  | Description |
| ------------- |:-------------:| -------:|------------:|
|isRefresh|Number|1|0 正在刷新  1 刷新结束|
|isLoad|Number|1|0 正在加载  1 加载结束|
|load_h|Number|45|距离底部触发更新的值|
|refresh_h|Number|60|距离顶部触发刷新的值|
|range|Number|130|刷新下拉允许出现的最大空白值|
|loadEnd|Boolean|false|没有更多数据可以加载了|


| Methods|Args|Required|Description|
| ------ |:--:|-------:|----------:|
|to-refresh||yes|触发刷新回调|
|to-load ||yes|触发加载更多回调|

## 特点
1. 基于vue2.0开发，不支持1.0
2. 不依赖zepto库
3. 使用了weui的loading样式，但没有引入整个weui，相对来说体积应该比较小
