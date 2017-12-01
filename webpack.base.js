var webpack = require("webpack");
var path = require("path");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry:{
        index:["./src/index.js"],
        vendor:['vue']
    },
    output: {
        path:__dirname + '/build/',
        publicPath: 'build/',
        filename: '[name].js',
        chunkFilename:'[name].js'
    },
    resolve:{
        modules:[
            path.resolve(__dirname,'src'),
            path.resolve(__dirname,'node_modules')
        ],
        extensions: [".vue",".js",".json"]
    },
     module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
                            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass"> 
                        }
                    }
                }
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/, //node_modules 文件夹除外
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
                // 方法一 css loader 在js中可以引入css 转化中对象；style-loader 插入style标签
                // use: ExtractTextPlugin.extract({
                //     use:"css-loader" //方法二 第一步*
                // })
            },
             {
                test: /\.scss$/, 
                use: ExtractTextPlugin.extract({
                    use: "css-loader!resolve-url-loader!ruby-sass-loader",
                    publicPath:"./"//如果没有定义，图片资源就会默认使用output的publicPath
                }),
                
            },
             /*{
                test: /\.(png|jpg|gif|svg)$/,//生成data格式没问题，但是页面报错。
                loader: 'url-loader?limit=8192&name=img/[name].[ext]' //处理css文件中小于8192的图片文件，用data格式代替
            }, */
            {
                test: /\.(png|jpg|gif|svg)$/, //引入css文件中大于8192的图片文件
                //use: 'file-loader?publciPath=../&outputPath=img/'//如果这里定义了outputPath，那么实际的路径最后会加上这个outputPath
                use: 'file-loader'
            }
        ]
    }
}