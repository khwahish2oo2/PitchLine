var express = require("express");
var app = express();
var mysql = require("mysql");
var fileuploader = require("express-fileupload");
app.listen(2002, function () {
    console.log("2002 server started");
});
app.use(express.urlencoded('extended:true'));
app.use(fileuploader());
var DbConfigKuch =
{
    host: "localhost",
    user: "root",
    password: "",
    database: "pitchline"
}
var dbCtrl = mysql.createConnection(DbConfigKuch);
dbCtrl.connect(function (err) {
    if (err)
        console.log(err);
    else
        console.log("*Successfully Connected To server*");
})
app.use(express.static("public"));
app.get("/", function (req, resp) {
    resp.sendFile(__dirname + "/public/index.html");
})
app.get("/pinvestor", function (req, resp) {
    resp.set("html");
    resp.sendFile(__dirname + "/public/profile-investor.html");
})
app.get("/pentrepreneur", function (req, resp) {
    resp.set("html");
    resp.sendFile(__dirname + "/public/profile-entrepreneur.html");
})
app.get("/angular", function (req, resp) {
    resp.set("html");
    // resp.send("<h2><center>Signup Here</h2></center>");
    resp.sendFile(process.cwd() + "/public/admin-panel.html");
})
app.get("/angulars", function (req, resp) {
    resp.set("html");
    // resp.send("<h2><center>Signup Here</h2></center>");
    resp.sendFile(process.cwd() + "/public/angular_signup.html");
})
app.get("/googleshark", function (req, resp) {
    resp.set("html");
    // resp.send("<h2><center>Signup Here</h2></center>");
    resp.sendFile(process.cwd() + "/public/google-shark.html");
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//index
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/JSONsearchRecord", function (req, resp) {
    var uid = req.query.Uid;
    dbCtrl.query("select * from signup where Email=?", [req.query.Uid], function (err, res) {
        if (err)
            resp.send(err);
        else
            resp.send(res);
    })
});

//Register:  insert the value in table in server on Signup
app.get("/ajaxSignup", function (req, resp) {
    var dataArray = [req.query.srole, req.query.semail, req.query.spwd];
    console.log(dataArray);
    dbCtrl.query("insert into signup values (?,?,?,current_date(),1)", dataArray, function (err) 
    {
        if (err)
            resp.send(err);
        else 
        {
            resp.send("*You Registered successfully");
        }
    })
});

//Register: Check the availability of Email while signing up.
app.get("/ajaxChckUser", function (req, resp) 
{
    // 1 or zero ki possibility h
    dbCtrl.query("select * from signup where Email=?", [req.query.uid], function (err, result) {
        if (err)
            resp.send(err);
        else 
        {
            if (result.length != 0)
                resp.send("This Email is already registered");
            else
                resp.send("");
        }
    })
})

//Login: Check weather the Email is registered with server while logging in
app.get("/AjaxCheckuser", function (req, resp) 
{
    dbCtrl.query("select * from signup where Email=? and Status=1", [req.query.Uid], function (err, result) 
    {
        if (err)
            resp.send(err);
        else 
        {
            if (result.length == 0)
                resp.send("*This Email is not registered");
            else
                resp.send("");
        }

    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//profile-investor-SAVE/submit
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/profile-save", function (req, resp)
{
    var PicName = "NoPhoto.png";
    if (req.files != null) 
    {
        PicName = req.body.EmailId + "-" + req.files.profilePic.name;
        var des = process.cwd() + "/public/uploads/" + PicName;
        req.files.profilePic.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("*Profile Photo Uploaded Successfully");
        });
    }
    var DocName = "NoDoc.png";
    if (req.files != null) {
        DocName = req.body.EmailId + "-" + req.files.aadhaarCard.name;
        var des = process.cwd() + "/public/uploads/" + DocName;
        req.files.aadhaarCard.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("*Document Uploaded Successfully");
        });
    }
    var dataAry = [req.body.EmailId, req.body.Name, PicName, DocName, req.body.contact, req.body.Address, req.body.Country, req.body.ocptn, req.body.Category, req.body.Amount, req.body.OtherInfo]
    dbCtrl.query("insert into investor values(?,?,?,?,?,?,?,?,?,?,?)", dataAry, function (err) {
        if (err)
            resp.send(err);
        else
            resp.send("Record saved successfully");
    });
})

//profile-investor-FETCH-Record                                                                       
app.get("/JSONfindRecord", function (req, resp) {
    var Email = req.query.Uid;
    dbCtrl.query("select * from investor where Email=?", [Email], function (err, result) 
    {
        if (err)
            resp.send(err);
        else {
            resp.send(result);
        }
    });
});

//profile-investor-UPDATE
app.post("/profile-update", function (req, resp) 
{
    var PicName;
    var DocName;
    if (req.files == null) 
    {
        PicName = req.body.hdn1;
        DocName = req.body.hdn2;
    }
    else
    {
        if (req.files.profilePic == null) 
        {
            PicName = req.body.hdn1;
        } 
        else 
        {
            PicName = req.body.EmailId + "-" + req.files.profilePic.name;
            var des = process.cwd() + "/public/uploads/" + PicName;
            req.files.profilePic.mv(des, function (err) 
            {
                if (err)
                    console.log(err);
                else
                    console.log("*Profile Photo Updated Successfully");
            });
        }
        if (req.files.aadhaarCard == null)
        {
            DocName = req.body.hdn2;
        } 
        else 
        {
            DocName = req.body.EmailId + "-" + req.files.aadhaarCard.name;
            var des = process.cwd() + "/public/uploads/" + DocName;
            req.files.aadhaarCard.mv(des, function (err) 
            {
                if (err)
                    console.log(err);
                else
                    console.log("*Document Updated Successfully");
            });
        }
    }

    var dataArray = [req.body.Name, PicName, DocName, req.body.contact, req.body.Address, req.body.Country, req.body.ocptn, req.body.Category, req.body.Amount, req.body.OtherInfo, req.body.EmailId];
    dbCtrl.query("update investor set Name=?,Photo=?,Aadhaar_Card=?, Contact_Number=?,Address=?,Country=?,Company=?,Interests=?,Investment_Size=?,Other_Information=? where Email=?", dataArray, function (err) 
    {
        if (err)
            resp.send(err);
        else 
        {
            resp.send("*Record Updated successfully");
        }
    });
})


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//profile-entrepreneur
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//profile-entrepreneur search
app.get("/JSONfetchRecord", function (req, resp) {
    var Email = req.query.uidkch;
    dbCtrl.query("select * from entrepreneur where Email=?", [req.query.uidkch], function (err, result) {
        if (err)
            resp.send(err);
        else {
            resp.send(result);
        }
    });
});

//profile-entrepreneur Save
app.post("/entrepreneur-save", function (req, resp) {
    var PicName = "NoPhoto.png";
    if (req.files != null) {
        PicName = req.body.EmailId + "-" + req.files.profilePic.name;
        var des = process.cwd() + "/public/uploads/" + PicName;
        req.files.profilePic.mv(des, function (err)
        {
            if (err)
                console.log(err);
            else
                console.log("*Profile Pic Uploaded Successfully");
        });
    }
    var DocName = "NoDoc.png";
    if (req.files != null) {
        DocName = req.body.EmailId + "-" + req.files.aadhaarCard.name;
        var des = process.cwd() + "/public/uploads/" + DocName;
        req.files.aadhaarCard.mv(des, function (err) {
            if (err)
                console.log(err);
            else
                console.log("*Document Uploaded Successfully");
        });
    }
    var dataAry = [req.body.EmailId, req.body.Name, PicName, DocName, req.body.contact, req.body.Address, req.body.Country, req.body.Category, req.body.Company, req.body.EstdIn, req.body.Sales, req.body.prtnr, req.body.OtherInfo]
    dbCtrl.query("insert into entrepreneur values(?,?,?,?,?,?,?,?,?,?,?,?,?)", dataAry, function (err) {
        if (err)
            resp.send(err);
        else
            resp.send("*Record saved successfully");
    });
})

//profile-entrepreneur-update
app.post("/entrepreneur-update", function (req, resp) {

    var PicName;
    var DocName;
    if (req.files == null)
    {
        PicName = req.body.hdn1;
        DocName = req.body.hdn2;
    }
    else 
    {
        if (req.files.profilePic == null) {
            PicName = req.body.hdn1;
        } 
        else {
            PicName = req.body.EmailId + "-" + req.files.profilePic.name;
            var des = process.cwd() + "/public/uploads/" + PicName;
            req.files.profilePic.mv(des, function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("*Profile Photo Updated Successfully");
            });
        }
        if (req.files.aadhaarCard == null)//no change in pic
        {
            DocName = req.body.hdn2;
        } 
        else 
        {
            DocName = req.body.EmailId + "-" + req.files.aadhaarCard.name;
            var des = process.cwd() + "/public/uploads/" + DocName;
            req.files.aadhaarCard.mv(des, function (err) 
            {
                if (err)
                    console.log(err);
                else
                    console.log("*Document Updated Successfully");
            });
        }
    }


    var dataAry = [req.body.Name, PicName, DocName, req.body.contact, req.body.Address, req.body.Country, req.body.Category, req.body.Company, req.body.EstdIn, req.body.Sales, req.body.prtnr, req.body.OtherInfo, req.body.EmailId];
    dbCtrl.query("update entrepreneur set Name=?,Photo=?,Aadhar_Card=?,Contact_Number=?,Address=?,Country=?,Category=?,Company=?,Established_In=?,Sales=?,Partners=?,Other_Information=? where Email=?", dataAry, function (err) {
        if (err)
            resp.send(err);
        else {
            resp.send("*Record Updated successfully");
        }
    });
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Investors admin Panel 
app.get("/showAll", function (req, resp) {
    dbCtrl.query("select * from sprofile", function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})
app.get("/doDelete", function (req, resp) {

    dbCtrl.query("delete from sprofile where Email=?", [req.query.Email], function (err, result) {
        if (err)
            resp.send(err);
        else
            if (result.affectedRows == 0)
                resp.send("Invalid id");
            else
                resp.send("Deleted");
    })
})


//Owners admin Panel 
app.get("/showAll2", function (req, resp) {
    dbCtrl.query("select Email, Name,Contact_Number, Country, Company, Established_In, Sales from entrepreneur", function (err, result) 
    {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})


app.get("/doDelete2", function (req, resp) {
    dbCtrl.query("delete from entrepreneur where Email=?", [req.query.Email], function (err, result)
    {
        if (err)
            resp.send(err);
        else
            if (result.affectedRows == 0)
                resp.send("Invalid id");
            else
                resp.send("Deleted");
    })
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/dofetchcategory", function (req, resp) {
    dbCtrl.query("select distinct Categoriesofinterest from sprofile", function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})

app.get("/dofetchcity", function (req, resp) {
    dbCtrl.query("select distinct City from sprofile", function (err, result) {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})

app.get("/moreinfo", function (req, resp) {
    dbCtrl.query("select * from sprofile where Email=?", [req.query.emailid], function (err, result) {
        if (err)
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
app.get("/search", function (req, resp) {
    console.log(req.query);
    var datary = [req.query.cat, req.query.city];
    console.log(datary);
    dbCtrl.query("select * from sprofile where Categoriesofinterest=? and City=?", datary, function (err, result) {
        if (err) {
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


app.get("/status_update", function (req, resp) 
{
    var dataAry = [req.query.Email];
    console.log(dataAry)
    dbCtrl.query("update signup set Status=2 where Email=?", dataAry, function (err) {
        if (err)
            resp.send(err);
        else {
            resp.send("Record Updated successfully");
        }
    });
})

app.get("/status_resume", function (req, resp) 
{
    var dataAry = [req.query.Email];
    console.log(dataAry)
    dbCtrl.query("update signup set Status=1 where Email=?", dataAry, function (err) {
        if (err)
            resp.send(err);
        else {
            resp.send("Record Updated successfully");
        }
    });
})

app.get("/showAll3", function (req, resp) {
    dbCtrl.query("select * from signup", function (err, result)
    {
        if (err)
            resp.send(err);
        else
            resp.send(result);
    })
})
