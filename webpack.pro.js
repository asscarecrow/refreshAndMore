var webpack = require("webpack");
var path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var baseConfig = require("./webpack.base.js");
var OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin")
var merge = require("webpack-merge");
module.exports = function(env){
 

  return merge(baseConfig,{
   output: {
        path:__dirname + '/build/static/',
        publicPath: './static/',
    },
    plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"production"',
  }),

    // extract css into its own file
    new ExtractTextPlugin('common-min.css'),//方法二 第二步*

    // 压缩外部CSS代码
    // 解决extract-text-webpack-plugin带了的CSS重复的问题
    new OptimizeCSSPlugin(),
//     new webpack.optimize.CommonsChunkPlugin({
//   //name: "",//需要提取公共的chunkname
//   // (the commons chunk name)
//   //async:true,
//   filename: "common-min.js",
  
// })
  //new webpack.optimize.CommonsChunkPlugin("common-min.js")
  new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',//需要提取公共的chunkname
            // (the commons chunk name)
            //async:true,
            filename: "common-min.js",
        })
    ]
})
}
