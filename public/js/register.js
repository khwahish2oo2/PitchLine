$(document).ready(function()
      {
            //----------------
            $("#Email").blur(function()   //This is for check weather Signup email is available or not.
            {
              var userId=$(this).val();        
              var urlWithData="/ajaxChckUser?uid="+userId;
              $.get(urlWithData,function(response)
              {                  
                $("#response").html(response);
              });
            })
            //----------------
            $("#register").click(function () 
            {
              var role = $("#Users").val();
              var email = $("#Email").val();
              var pwd = $("#Password").val();              
              var urlwithdata = "/ajaxSignup?semail=" + email + "&spwd=" + pwd + "&srole=" + role;
              $.get(urlwithdata, function (response) 
              {
                $("#response").html(response);
              })
            })
            //----------------
            $("#Password").blur(function(){
              var exp =/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
              var pwd = $(this).val();
              if (exp.test(pwd)==false)
              document.getElementById("response").innerHTML="*Very Weak Password";
              else
              document.getElementById("response").innerHTML="";
            });
              $(".fa").mousedown(function() //Eye open and close 
              {
                $("#Password").attr("type","text");
                // $("#txtPwdL").attr("type","text");
                $(".fa").removeClass("fa-eye-slash");
                $(".fa").addClass("fa-eye");
              });
              //--------------
              $(".fa").mouseup(function()
              {
                $("#Password").prop("type","password");
                //$("#txtPwdL").prop("type","password");
                $(".fa").removeClass("fa-eye");
                $(".fa").addClass("fa-eye-slash");
              });
      });