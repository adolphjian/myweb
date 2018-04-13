$(function(){


  // 处理轮播
  // 获取轮播图数据
  function loadSwiperData(){
    return axios.get('home/swiperdata');
  }
  // 渲染轮播图模板
  function renderSwiper(param){
    return new Promise(function(resolve,reject){
      let html = template('swiperTpl',{list: param.data});
      $('#swiperInfo').html(html);
      resolve();
    });
  }
  function handleSwiper(){
    return new Promise(function(resolve,reject){
      new Swiper ('.swiper-container', {
        loop: true,
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
        }
      })
      resolve();
    });  
  }
  // 页面初始化完成之后，触发该事件
  $(document).on("pageInit", function(e, pageId, $page) {
    // 处理轮播效果
    loadSwiperData()
      .then(renderSwiper)
      .then(handleSwiper)
      .then(function(){
        $.toast('success');
      })
      .catch(function(){
        $.toast('服务器错误');
      })
  });
  $.init();
});