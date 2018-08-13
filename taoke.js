// ==UserScript==
// @name         咚咚抢淘客采集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       huaqi@wangqingxue
// @match        http://www.dataoke.com/ddq
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// ==/UserScript==
function request(arr) {
    let errorary = [];
    arr.forEach((item)=>{
        let url = `http://www.dataoke.com/item?id=${item.id}`;
        $.ajax({
            url: url,
            async: false,
            success: function (responseText) {
                try {
                    item.numid = responseText.match(/item\.htm\?id=([0-9]+)/)[1];
                } catch (error) {
                    errorary.push(item);
                }
            }
        })
    })
    if(errorary.length==0){
        console.log('请求结束')
    }else{
        request(errorary)
    }
}
(function() {
    'use strict';
    let goodsList = dataDef;
    let data = [];
    for(key in goodsList){
        goodsList[key].forEach((item) => {
            data.push(item);
        });
    }
    console.log(data.length);
    request(data);
    let temp = {data:data,msg:'et sed minim'};
    temp = JSON.stringify(temp)
    console.log(temp);
    localStorage.setItem('temp',temp);
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
            console.log(err,'发生错误');
        }
    })
})();
