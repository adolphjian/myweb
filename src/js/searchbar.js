$(function(){
  // 搜索条业务功能
  // 初始化遮罩层
  let layer = $('<div class="search"><div id="searchInfo"></div></div>');
  // 设置遮罩层到顶部的距离
  layer.css('top',$('.mysearch').height());
  // 隐藏遮罩层
  layer.hide();
  // 追加到页面
  layer.appendTo('body');

  // 根据输入的关键字加载列表数据
  function loadKeyWordData(keyword){
    return axios.get('goods/qsearch', {
      params: {
        query: keyword
      }
    });
  }
  // 渲染数据到提示列表
  function renderList(param){
    return new Promise(function(resolve,reject){
      let html = template('searchTpl',param.data);
      $('#searchInfo').html(html);
      resolve();
    });
  }

  // 处理所有的事件
  $('#search').on('focus',function(){
    layer.show();
  })
  $('#search').on('blur',function(){
    // 保证点击a标签之后再触发隐藏操作
    setTimeout(function(){
      layer.hide();
    },0);
  })
  $('#search').on('input',function(){
    // 输入关键字的时候，动态调用后台接口，从而获取该关键字所有对应的数据列表
    let kw = $('#search').val();
    loadKeyWordData(kw).then(renderList);
  })
});