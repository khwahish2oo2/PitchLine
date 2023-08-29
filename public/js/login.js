$(document).ready(function()
      {
            //--------------------   
            $("#Email").blur(function()   //This is for check weather Signup email is registered one
                {
                  var usrId=$(this).val();        
                  var urlWithData="/AjaxCheckuser?Uid="+usrId;
                  $.get(urlWithData,function(resp)
                  {                  
                      $("#response").html(resp);
                  });
                })
                //-----------
            $("#login").click(function() //This to check in Login page is Email id trying to be login is registered and if yes then is the password correct
              {                
                var UserId=$("#Email").val();
                var Pwd=$("#Password").val();
                var urlWithData="/JSONsearchRecord?Uid="+UserId;
                $.getJSON(urlWithData,function(responseJSON)
                {
                  if(responseJSON.length==0)
                  document.getElementById("response").innerHTML="*This Email is not registered";
                  else
                  {
                    //alert(JSON.stringify(responseJSON));
                    if(responseJSON[0].Password==Pwd)
                    {
                      localStorage["mail"]=responseJSON[0].Email;
                      var x=localStorage["mail"];
                      //alert(JSON.stringify(responseJSON[0].Email));
                      if(responseJSON[0].User_Type=="Investor")
                      {
                        window.location.replace("/home-investor.html");
                      }
                      if(responseJSON[0].User_Type=="Entrepreneur")
                      {
                        window.location.replace("/home-entrepreneur.html");
                      }
                    }                     
                    else
                    {
                      document.getElementById("response").innerHTML="*Incorrect Password Entered";                  
                    }                              
                  }      
                })
              })  
              //------------
              
              //-------------
              $(".fa").mousedown(function() //Eye open and close 
              {
                $("#Password").attr("type","text");
                $(".fa").removeClass("fa-eye-slash");
                $(".fa").addClass("fa-eye");
              });
              //--------------
              $(".fa").mouseup(function()
              {
                $("#Password").prop("type","password");
                $(".fa").removeClass("fa-eye");
                $(".fa").addClass("fa-eye-slash");
              });
      });