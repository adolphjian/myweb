$(function(){
  // 设置验证码延时时间
  let delayTime = 60;

  // 表单验证

  // 验证码处理
  function handleCode(mobile){
    return axios.post('users/get_reg_code',{
      mobile: mobile
    })
  }
  // 处理验证码按钮的状态
  function handleCodeState(){
    delayTime--;
    if(delayTime > 0) {
      // 禁用按钮的状态并动态更新按钮的文字信息
      $('#codeButton').addClass('button-fill').addClass('disabled').attr('disabled','disabled').text(delayTime+'秒后重试').removeAttr("href");
      setTimeout(handleCodeState,1000);
    }else{
      $('#codeButton').removeClass('button-fill').removeClass('disabled').removeAttr('disabled').text('重新发送验证码');
    }
  }

  // 提交表单
  function submitForm(formData){
    return axios.post('users/reg',formData);
  }

  $(document).on("pageInit", function(e, pageId, $page) {
    // 绑定验证码单击事件
    $('#codeButton').on('click',function(){
      // if(delayTime > 0) {
      //   return;
      // }
      // delayTime = 60;
      let mobile = $('#mobile').val();
      let reg = /^\d{11}$/;
      if(!reg.test(mobile)){
        $.toast('手机号格式错误');
        return;
      }
      // 处理验证码按钮记时效果
      handleCodeState();
      // 调用验证码生成接口
      handleCode(mobile)
        .then(function(data){
          $.toast(data.data);
        })
    })

    // 绑定单击注册按钮事件
    $('#registerBtn').on('click',function(){
      let mobile = $('#mobile').val();
      let code = $('#code').val();
      let email = $('#email').val();
      let pwd = $('#pwd').val();
      let gender = $('#gender').val();
      submitForm({
        mobile:mobile,
        code:code,
        email:email,
        pwd:pwd,
        gender:gender
      }).then(function(data){
        if(data.meta.status == 200){
          $.toast(data.meta.msg);
        }
      })
    })
  })
  $.init();
});