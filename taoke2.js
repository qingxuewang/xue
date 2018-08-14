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
    let errorary = [];
    console.log('我应该请求',arr.length,'次')
    arr.forEach((item)=>{
        let url = `http://www.dataoke.com/item?id=${item.id}`;
        let flag = localStorage.getItem(`id_numid_${item.id}`)
        // 找到则不需要再次请求numid
        if(flag){
            console.log('无需请求numid，已经存在numid');
        }else{
            $.ajax({
                url: url,
                async: false,
                success: function (responseText) {
                    try {
                        item.numid = responseText.match(/item\.htm\?id=([0-9]+)/)[1];
                        localStorage.setItem(`id_numid_${item.id}`,item.numid)
                    } catch (error) {
                        errorary.push(item);
                    }
                }
            })
        }
    })
    if(errorary.length==0){
        console.log('请求结束');
    }else{
        request(errorary);
    }
}

// 发送不需要修改
function ajax(data){
    $.ajax({
        url:'http://admin.api.huaqiweb.com/mock/51/tbk/assistant/tbkRushItem',
        type:'post',
        contentType:'application/json',
        async: false,
        data:data,
        success:function (responseText) {
            console.log('OK')
        },
        error:function(err){
            console.log(err,'发生错误');
        }
    })
}

function init() {
    'use strict';
    let goodsList = dataDef;
    let data = [];
    for(key in goodsList){
        goodsList[key].forEach((item) => {
            let flag = localStorage.getItem(`id_md5_${item.id}`)
            console.log(flag)
            if(flag!=md5(JSON.stringify(item))){
                console.log('需存储md5')
                data.push(item);
                localStorage.setItem(`id_md5_${item.id}`,md5(JSON.stringify(item)))
            }
        });
    }
    console.log(data,'data');
    console.log(data.length,'data.length');
    if(data.length>0){
        console.log('需要请求numid',data.length,'次')
        request(data);
        let temp = {data:data,msg:'et sed minim'};
        temp = JSON.stringify(temp);
        ajax(temp);
    }else{
        console.log('数据没有发生变化，无需请求numid')
    }
};
init();
// 半小时刷新当前页面，再次执行代码
setTimeout(function(){
    history.go(0);
},1800*1000)