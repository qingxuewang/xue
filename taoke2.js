// ==UserScript==
// @name         咚咚抢淘客采集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       huaqi@wangqingxue
// @match        http://www.dataoke.com/ddq
// @grant        none
// @require      https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.min.js
// ==/UserScript==


function request(arr) {
    let errorary = []
    console.log('我应该请求',arr.length,'次')
    arr.forEach((item)=>{
        let url = `http://www.dataoke.com/item?id=${item.id}`
        let flag = localStorage.getItem(`id_numid_${item.id}`)
        // 找到则不需要再次请求numid
        if(flag){
            item.numid = flag
            console.log('无需请求numid，已经存在numid')
        }else{
            $.ajax({
                url: url,
                async: false,
                success: function (responseText) {
                    try {
                        item.numid = responseText.match(/item\.htm\?id=([0-9]+)/)[1]
                        localStorage.setItem(`id_numid_${item.id}`,item.numid)
                    } catch (error) {
                        errorary.push(item)
                    }
                }
            })
        }
    })
    if(errorary.length==0){
        console.log('请求结束')
    }else{
        request(errorary)
    }
}

// 发送不需要修改
function saveGoodsList(data){
    let temp = {data:data,msg:'saveGoodsList'}
    temp = JSON.stringify(temp)
    $.ajax({
        url:'http://admin.api.huaqiweb.com/mock/51/tbk/assistant/tbkRushItem',
        type:'post',
        contentType:'application/json',
        async: false,
        data:temp,
        success:function (responseText) {
            console.log('OK')
        },
        error:function(err){
            console.log(err,'发生错误')
        }
    })
}
function clear(){
    let oldDate = localStorage.getItem('oldDate')
    let currentDay = new Date().toLocaleDateString()
    if(new Date().toLocaleDateString() === oldDate){
        oldDate = currentDay
        localStorage.setItem('oldDate',oldDate)
        console.log("not clear")
    }else{
        console.log("clear localStorage")
        localStorage.clear()
        localStorage.setItem('oldDate',currentDay)
    }
   
}
function init() {
    'use strict'
    let goodsList = dataDef
    let data = []
    for(key in goodsList){
        goodsList[key].forEach((item) => {
            let flag = localStorage.getItem(`id_md5_${item.id}`)
            if(flag!=md5(JSON.stringify(item))){
                data.push(item);
                localStorage.setItem(`id_md5_${item.id}`,md5(JSON.stringify(item)))
            }
        });
    }
    console.log(data.length,'data.length')
    if(data.length>0){
        console.log('需要请求numid',data.length,'次')
        request(data);
        let times = Math.ceil(data.length/100)
        for(let i=0;i<times;i++){
            saveGoodsList(data.splice(0,100))
        }
    }else{
        console.log('商品数据没有发生变化')
    }
};
clear();
init();

// 半小时刷新当前页面，再次执行代码
setTimeout(function(){
    history.go(0)
},900000)