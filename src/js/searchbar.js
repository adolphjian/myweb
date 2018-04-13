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
    layer.hide();
  })
  $('#search').on('input',function(){
    let kw = $('#search').val();
    loadKeyWordData(kw).then(renderList);
  })
});