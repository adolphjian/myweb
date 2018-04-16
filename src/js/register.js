$(function(){

  // 表单验证

  // 验证码处理
  function handleCode(mobile){
    return axios.post('users/get_reg_code',{
      mobile: mobile
    })
  }

  // 提交表单
  function submitForm(formData){
    return axios.post('users/reg',formData);
  }

  $(document).on("pageInit", function(e, pageId, $page) {
    // 绑定验证码单击事件
    $('#codeButton').on('click',function(){
      let mobile = $('#mobile').val();
      let reg = /^\d{11}$/;
      if(!reg.test(mobile)){
        $.toast('手机号格式错误');
        return;
      }
      handleCode(mobile)
        .then(function(data){
          $.toast(data.data);
        })
    })

    // 绑定单击注册按钮事件
    $('#registerBtn').on('click',function(){
      console.log(1)
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