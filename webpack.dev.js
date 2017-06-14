var webpack = require("webpack");
var path = require("path");
var baseConfig = require("./webpack.base.js");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var merge = require("webpack-merge");

module.exports=function(env){
    
   
    
    return merge(baseConfig,{
   
    plugins: [
        new ExtractTextPlugin('common.css'),//方法二 第二步*
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',//需要提取公共的chunkname
            // (the commons chunk name)
            //async:true,
            filename: "common.js",
        })
    
   // new webpack.HotModuleReplacementPlugin()

    ]
})}