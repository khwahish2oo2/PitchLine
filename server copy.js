var express=require("express");
var app=express();
var mysql=require("mysql");
var fileuploader=require("express-fileupload");
app.listen(2004,function()
{
    console.log("server started");
});
var DbConfigKuch=
{
    host:"localhost",
    user:"root",
    password:"",
    database:"pitchline" 
}   
var dbCtrl=mysql.createConnection(DbConfigKuch);
dbCtrl.connect(function(err)
{
    if(err)
    console.log(err);
    else
    console.log("*Successfully Connected To server*");
})
app.use(express.static("public"));
app.get("/",function(req,resp){
    resp.sendFile(__dirname+"/public/index.html");
})
app.get("/pshark",function(req,resp){
    resp.set("html");
    resp.sendFile(__dirname+"/public/profile-shark.html");
})  
app.get("/powner",function(req,resp){
    resp.set("html");
    resp.sendFile(__dirname+"/public/profile-owner.html");
})  
app.get("/angular",function(req,resp){
    resp.set("html");
   // resp.send("<h2><center>Signup Here</h2></center>");
   resp.sendFile(process.cwd()+"/public/admin-panel.html");
})
app.get("/angulars",function(req,resp){
    resp.set("html");
   // resp.send("<h2><center>Signup Here</h2></center>");
   resp.sendFile(process.cwd()+"/public/angular_signup.html");
})
app.get("/googleshark",function(req,resp){
    resp.set("html");
   // resp.send("<h2><center>Signup Here</h2></center>");
   resp.sendFile(process.cwd()+"/public/google-shark.html");
})
    app.use(express.urlencoded('extended:true'));
    app.use(fileuploader());

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//index
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.get("/JSONsearchRecord",function(req,resp)
    {
       var uid=req.query.Uid;
       dbCtrl.query("select * from signup where Email=?",[req.query.Uid],function(err,res)
       {
           if(err)
           resp.send(err);
           else
           resp.send(res);
       })
    });

//Index insert the value in table in server on Signup
    app.get("/ajaxSignup", function (req, resp) {
        var datAry = [req.query.rolekuch,req.query.emailkuch,req.query.pwdkuch];
        console.log(datAry);
        dbCtrl.query("insert into signup values (?,?,?,current_date(),1)", datAry, function (err) {
            if (err)
                resp.send(err);
            else {
                resp.send("You Registered successfully");
            }
        })
    });  


    app.get("/status_update", function(req,resp){
        var dataAry=[req.query.Email];
        console.log(dataAry)
             dbCtrl.query("update signup set Status=2 where Email=?",dataAry,function(err){
                    if(err)
                        resp.send(err);
                    else
                    {
                       resp.send("Record Updated successfully"); 
                    }
            });
          })

          app.get("/showAll3",function(req,resp){
            dbCtrl.query("select * from signup",function(err,result){
                if(err)
                resp.send(err);
                else
                resp.send(result);
            })
        })
//Index Check weather the mail oid is regisyered with server while logging in
 app.get("/AjaxCheckuser",function(req,resp)
     {
     dbCtrl.query("select * from signup where Email=? and Status=1",[req.query.Uid],function(err,result){
         if(err)
         resp.send(err);
         else
         {
         if(result.length==0)
         resp.send("Invalid Email Id");
         else
         resp.send("Email Id verified");
         }
         
     })
 })
//Index Check the availability of email while signing up.
 app.get("/ajaxChckUser",function(req,resp)
     {
     // 1 or zero ki possibility h
     dbCtrl.query("select * from signup where Email=?",[req.query.uid],function(err,result){
         if(err)
         resp.send(err);
         else{
         if(result.length==0)
         resp.send("This Email id is available");
         else
         resp.send("This Email is already registered");
         }
     })
 })

 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 //profile-shark-SAVE/submit
 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 app.post("/profile-save",function(req,resp){
     /*console.log(req.body.Category);
     var dat=req.body.Category;
     dbCtrl.query("insert into sprofile (req.body.Category)",dat,function(err){
         if(err)
         console.log(err);
         else
         console.log("Record saved");
     })*/
    var newName="nopic.png";
    if(req.files!=null)
    {
        newName=req.body.EmailId+"-"+req.files.profilePic.name;
        var des=process.cwd()+"/public/uploads/"+newName;
        req.files.profilePic.mv(des,function(err)
        {
            if(err)
            console.log(err);
            else
            console.log("*****Profile Pic Uploaded Successfully*****");
        });
    }
    var newNamee="nopic.png";
    if(req.files!=null)
    {
        newNamee=req.body.EmailId+"-"+req.files.aadhaarCard.name;
        var des=process.cwd()+"/public/uploads/"+newNamee;
        req.files.aadhaarCard.mv(des,function(err)
        {
            if(err)
            console.log(err);
            else
            console.log("*****Aadhaar Card Uploaded Successfully*****");
        });
    }
    var dataAry=[req.body.EmailId,req.body.Name,newName,newNamee,req.body.contact,req.body.Address,req.body.Country,req.body.ocptn,req.body.Category,req.body.Amount,req.body.OtherInfo] 
    dbCtrl.query("insert into investor values(?,?,?,?,?,?,?,?,?,?,?)",dataAry,function(err)
    {
        if(err)
        resp.send(err);
        else
        resp.send("Record saved successfully"); 
    });
})

//profile-shark-FETCH                                                                          //ismei profile pic display nhi hoti h
 app.get("/JSONfindRecord",function(req,resp)
{
    var Email=req.query.uidkch;
    dbCtrl.query("select * from investor where Email=?",[req.query.uidkch],function(err,result)
    {
        if(err)
        resp.send(err);
        else
        {
            resp.send(result);
        }
    });
});

//profile-shark-UPDATE
app.post("/profile-update", function(req,resp){
    var newName;
    var newNamee;
    if(req.files==null)
    {
        newName=req.body.hdn1;
        newNamee=req.body.hdn2;
    }
    else
    {
        if(req.files.profilePic==null)
    {
        newName=req.body.hdn1;
    }else
       
        {
            newName=req.body.EmailId+"-"+req.files.profilePic.name;
            var des=process.cwd()+"/public/uploads/"+newName;
             req.files.profilePic.mv(des, function(err)
            {
             if(err)
                   console.log(err);
              else
                    console.log("PP Updated Successfullllyyyy");
            });
        }
        if(req.files.aadhaarCard==null)//no change in pic
        {
            newNamee=req.body.hdn2;
        }else
            
            {
                newNamee=req.body.EmailId+"-"+req.files.aadhaarCard.name;
                var des=process.cwd()+"/public/uploads/"+newNamee;
                 req.files.aadhaarCard.mv(des, function(err)
                {
                 if(err)
                       console.log(err);
                  else
                        console.log("AC Updated Successfullllyyyy");
                });
            }
    }
    
        var dataAry=[req.body.Name,req.body.contact,req.body.ocptn,req.body.Address,req.body.Country,req.body.State,req.body.City,req.body.Category,req.body.Count,req.body.Amount,newName,newNamee,req.body.OtherInfo,req.body.EmailId];
         dbCtrl.query("update set Name=?,Contact_Number=?,Occupation=?,Address=?,Country=?,State=?,City=?,Categoriesofinterest=?,No_of_companies_invested=?,Amount_Invested=?,Profile_Pic=?,Aadhaar_Card=?,Other_Information=? where Email=?",dataAry,function(err){
                if(err)
                    resp.send(err);
                else
                {
                   resp.send("Record Updated successfully"); 
                }
        });
      })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //profile-owner
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      app.post("/po-save",function(req,resp){
        var newName="nopic.png";
        if(req.files!=null)
        {
            newName=req.body.EmailId+"-"+req.files.aadhaarCard.name;
            var des=process.cwd()+"/public/uploads/"+newName;
            req.files.aadhaarCard.mv(des,function(err)
            {
                if(err)
                console.log(err);
                else
                console.log("*****Aadhaar Card Uploaded Successfully*****");
            });
        }

        var dataAry=[req.body.EmailId,req.body.Name,req.body.contact,newName,req.body.Address,req.body.Country,req.body.State,req.body.City,req.body.Company,req.body.EstdIn,req.body.Sales,req.body.prtnr,req.body.Eval,req.body.OtherInfo] 
        dbCtrl.query("insert into oprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",dataAry,function(err)
        {
            if(err)
            resp.send(err);
            else
            resp.send("Record saved successfully"); 
        });
    })
    //profile-owner search
    app.get("/JSONfetchRecord",function(req,resp)
    {
        var Email=req.query.uidkch;
        dbCtrl.query("select * from oprofile where Email=?",[req.query.uidkch],function(err,result)
        {
            if(err)
            resp.send(err);
            else
            {
                resp.send(result);
            }
        });
    });
    //profile-owner-update
app.post("/po-update", function(req,resp){
    
    var newNamee;
    if(req.files==null)//no change in pic
        {
            newNamee=req.body.hdn2;
        }
        else
            if(req.files!=null)
            {
                newNamee=req.body.EmailId+"-"+req.files.aadhaarCard.name;
                var des=process.cwd()+"/public/uploads/"+newNamee;
                 req.files.aadhaarCard.mv(des, function(err)
                {
                 if(err)
                       console.log(err);
                  else
                        console.log("AC Updated Successfullllyyyy");
                });
            }
       
        var dataAry=[req.body.Name,req.body.contact,newNamee,req.body.Address,req.body.Country,req.body.State,req.body.City,req.body.Company,req.body.EstdIn,req.body.Sales,req.body.prtnr,req.body.Eval,req.body.OtherInfo,req.body.EmailId];
         dbCtrl.query("update oprofile set Name=?,Contact_Number=?,Aadhaar_Card=?,Address=?,Country=?,State=?,City=?,Company=?,Established_In=?,Sales=?,Partners=?,Evaluations=?,Other_Information=? where Email=?",dataAry,function(err){
                if(err)
                    resp.send(err);
                else
                {
                   resp.send("Record Updated successfully"); 
                }
        });
      })

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //Investors admin Panel 
    app.get("/showAll",function(req,resp){
        dbCtrl.query("select * from sprofile",function(err,result){
            if(err)
            resp.send(err);
            else
            resp.send(result);
        })
    })
    app.get("/doDelete",function(req,resp)

    {
        
    dbCtrl.query("delete from sprofile where Email=?",[req.query.Email],function(err,result){
        if(err)
            resp.send(err);
        else
            if(result.affectedRows==0)
            resp.send("Invalid id");
            else
            resp.send("Deleted");
    })
    })
    //Owners admin Panel 
    app.get("/showAll2",function(req,resp){
        dbCtrl.query("select * from oprofile",function(err,result){
            if(err)
            resp.send(err);
            else
            resp.send(result);
        })
    })


    app.get("/doDelete2",function(req,resp)
    {
    dbCtrl.query("delete from oprofile where Email=?",[req.query.Email],function(err,result){
        if(err)
            resp.send(err);
        else
            if(result.affectedRows==0)
            resp.send("Invalid id");
            else
            resp.send("Deleted");
    })
    })

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/dofetchcategory",function(req,resp)
{
    dbCtrl.query("select distinct Categoriesofinterest from sprofile",function(err,result){
        if(err)
            resp.send(err);
        else
            resp.send(result);
    })
})

app.get("/dofetchcity",function(req,resp)
{
    dbCtrl.query("select distinct City from sprofile",function(err,result){
        if(err)
            resp.send(err);
        else
            resp.send(result);
    })
})

app.get("/moreinfo",function(req,resp)
{
    dbCtrl.query("select * from sprofile where Email=?",[req.query.emailid],function(err,result){
        if(err)
            resp.send(err);
        else
            resp.send(result);
    })
})
// app.get("/doSearching",function(req,resp)
// {
//     console.log(req.query);
//      dbCtrl.query("select Name from sprofile where Categoriesofinterest=?",req.query.cat,function(err,result){
//          if(err)
//          {
//             console.log(err);
//              //resp.send(err);
//          }
//          else
//              //resp.send(result);
//             {
//                 console.log(result);
//              resp.send(result);
//             } 
//      })
//     // dbCtrl.query("select * from sprofile where Categoriesofinterest=? and City=?",req.query.Categoriesofinterest,req.query.City,function(err,result){
//     //     if(err)
//     //     {
//     //         console.log(err);

//     //     }
//     //     else
//     //     {
//     //         console.log(result);
//     //         resp.send(result);
//     //     }
//     // })
// })
app.get("/search",function(req,resp){
    console.log(req.query);
    var datary=[req.query.cat,req.query.city];
    console.log(datary);
     dbCtrl.query("select * from sprofile where Categoriesofinterest=? and City=?",datary,function(err,result){
         if(err)
         {
            console.log(err);
             //resp.send(err);
         }
         else
             //resp.send(result);
            {
                console.log(result);
             resp.send(result);
            } 
        })
})
