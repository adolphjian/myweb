$(function(){

  // 加载分类数据
  function loadCateData(){
    return axios.get('categories');
  }
  // 渲染左侧菜单
  function renderLeftMenu(data){
    return new Promise(function(resolve,reject){
      // 渲染左侧菜单
      let html = template('leftMenuTpl',data.data);
      $('#leftMenuInfo').html(html);
      // 绑定菜单事件
      $('#leftMenuInfo').find('.items').on('click',function(){
        // 渲染右侧
        renderRightCate(data.data);
      })
      resolve(data.data);
    })
  }
  // 渲染右侧分类信息
  function renderRightCate(data){
    return new Promise(function(resolve,reject){
      console.log(data)
    })
  }

  $(document).on("pageInit", function(e, pageId, $page) {
    // 先显示提示效果
    $.showPreloader('正在加载分类数据');
    // 调用接口
    loadCateData()
      .then(renderLeftMenu)
      .then(renderRightCate)
      .then(function(){
        $.toast('加载成功')
      })
      .catch(function(){
        $.toast('服务器错误')
      })
      .finally(function(){
        $.hidePreloader('已经完成');
      })
  });
  $.init();
});