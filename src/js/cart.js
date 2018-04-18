$(function(){
  // 当前购物车数据
  let currentData = null;
  // 加载购物车数据
  function loadCartData(cartTpl){
    return axios.get('my/cart/all').then(function(data){
      let info = data.data.cart_info;
      return {
        data: JSON.parse(info),
        tplId: cartTpl
      }
    })
  }
  // 渲染模板
  function renderCartInfo(params){
    console.log(params)
    return new Promise(function(resolve,reject){
      // 初始化购物车数据
      currentData = params.data;
      // 对后台数据进行二次加工
      let goods = [];
      for(let key in currentData){
        goods.push(currentData[key]);
      }
      let html = template(params.tplId, goods);
      $('#cartInfo').html(html);
      // 把数据传递到下一步，用于计算总价
      resolve(goods);
    })
  }
  // 计算商品总价
  function calcMoney(data){
    return new Promise(function(resolve,reject){
      let total = 0;
      data.forEach(function(item){
        total += item.goods_price * item.amount;
      })
      $('#totalPrice').html('总价：￥' + total);
      resolve();
    })
  }
  // 控制商品数量
  function controlProductNum(){
    return new Promise(function(resolve,reject){
      // 给加号、减号和输入框绑定事件
      $('.numbox .numbox-minus').on('click',function(){
        // 仅仅修改当前输入框的数量
        // 修改输入框数量，然后把最新数量传递给处理逻辑（自定义事件）
        let input = $(this).siblings('input').eq(0);
        let current = input.val(); 
        if(current > 1) {
          current--;
        }
        input.val(current);
        // 触发事件,并且携带参数
        $(this).parent('.numbox').trigger('change-cart', current);
      })
      $('.numbox .numbox-plus').on('click',function(){
        let input = $(this).siblings('input').eq(0);
        let current = input.val();
        current++;
        input.val(current);
        // 触发事件
        $(this).parent('.numbox').trigger('change-cart', current);
      })
      $('.numbox .numbox-input').on('input',function(){
        let current = $(this).val();
        // 如果不是数字，需要提示用户重新输入
        if(!/^\d+$/.test(current)){
          $.toast('必须输入数字');
          return;
        }
        $(this).parent('.numbox').trigger('change-cart', current);
      })
      resolve();
    })
  }
  // 同步购物车数据
  function syncCart(params){
    return axios.post('my/cart/sync',params)
  }
  // 更新购物车
  function updateCart(){
    return new Promise(function(resolve,reject){
      // 注册事件
      $('.numbox').on('change-cart',function(e, num){
        // 获取到数量之后，已改通知后台
        // 获取当前修改的商品的id
        let gId = $(this).attr('data-pId');
        // 根据当前id更新数据中的商品数量
        currentData[gId].amount = num;
        // 这里只能直接调用，不可以通过then调用
        syncCart({infos: JSON.stringify(currentData)})
          .then(function(data){
            // 更新当前最新购物车数据
            let info = JSON.parse(data.data.cart_info);
            let goods = [];
            for(let key in info){
              goods.push(info[key]);
            }
            return goods;
          })
          .then(calcMoney)
          .then(function(){
            $.toast('更新成功');
          })
          .catch(function(e){
            $.toast('服务器错误');
          })
      });
      resolve();
    });
  }
  // 删除购物车商品
  function deleteCart(){
    return new Promise(function(resolve,reject){
      $('#editBtn').on('click',function(){
        this.flag = this.flag?!this.flag:true;
        let goods = [];
        for(let key in currentData){
          goods.push(currentData[key]);
        }
        if(this.flag){
          $(this).text('完成');
          $('#delBtn').show();
          // 渲染编辑模板
          // let html = template('cartTpl4Edit',goods);
          // $('#cartInfo').html(html);
          renderCommon('cartTpl4Edit');
        }else{
          $(this).text('编辑');
          $('#delBtn').hide();
          // 渲染展示模板
          // let html = template('cartTpl',goods);
          // $('#cartInfo').html(html);
          renderCommon('cartTpl');
        }
      })
      resolve();
    })
  }
  
  // 渲染模板通用方法
  function renderCommon(cartTpl){
    loadCartData(cartTpl)
      .then(renderCartInfo)
      .then(calcMoney)
      .then(controlProductNum)
      .then(updateCart)
      .then(deleteCart)
      .catch(function(e){
        $.toast(e)
      })
  }

  $(document).on("pageInit", function(e, pageId, $page) {
    renderCommon('cartTpl');
  })
  $.init();
});