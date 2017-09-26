'use strict';

var express = require('express');

var bcrypt = require('bcryptjs');
var router = express.Router();
var db = require('../../models');
var jwtSecret = require('../../config/environment/index').jwtSecret;
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
//var mailer = require("nodemailer");
var helpers = require('../../helpers');
router.get('/me', function(req, res) {

    res.send(req.session.user);
});


router.post('/logout', function(req, res) {
    req.session.reset();
    return res.send(true);
});

router.post('/register', function(req, res, next) {

    var username = req.body.username; //bodyParser does the magic
    var password = req.body.password;
    var email = req.body.email;

    var user = db.User.build({email:email, username: username, password: password });
      db.User.checkUserName(username).then(function(objU){
            if(objU.status == 'success'){
                db.User.checkEmail(email).then(function(objUE){
                console.log("check email")
                console.log(objUE.status)
                  if(objUE.status == 'success'){
                        res.json(objUE);
                      user.add().then(function(objUser){
                           res.send(true);

//                        req.session.user = {id: objUser.id,username: req.body.username}
//                        res.send({
//                                  token: jwt.sign({
//                                                id: objUser.id,
//                                                username: req.body.username,
//                                                email:objUser.email,
//
//                                            }, jwtSecret),
//                                            user: {
//                                                id: objUser.id,
//                                                username: req.body.username,
//                                                email:objUser.email,
//                                                status:'success'
//                                  }
//                            });
                      });
                  }else{

                    res.json(objUE);
                  }
                });


            }else{

              res.json(objU);
            }

          });

//    res.json({"code": 100, "status": "Error in connection database"});
//    return;
});


router.post('/forgot-password', function(req, res, next) {

    var email = req.body.email;
    console.log("email **********")
    console.log(email)

    db.User.findOne({
            where: {email:email}

          })
          .then(function(objU){
              console.log("objU.email")
              console.log(objU.email)
//              console.log("objU.uuid")
//              console.log(objU.uuid)

              if(objU){
                var html="<h1>Hi " + objU.username + "</h1>"
                 html += "<h1>Please <a href='http://localhost:9000/reset-password/[uuid]'>click here</a> to reset the password.</h1>"
                 html = html.replace("[uuid]",objU.uuid)
                 var sub = "Reset Email"
                 var isSent = helpers.mail.sendMail(objU.email,sub,html)
                 console.log("IIISIIISS")

                 res.json({'status':'success','msg':"Confirm email sent"})


              }else{

                console.log("else else")
                res.json({'status':'error','msg':"Please enter valid email."})
              }

          })

});



router.post('/reset-password', function(req, res, next) {

    var password = req.body.password;
    var uuid = req.body.uuid;
    console.log("password **********")
    console.log(password)
    console.log(uuid)
//    var user = db.User.build({uuid:uuid, password: password });
//    user.update().then(function(objUser){
//      console.log("objUser")
//    });
    db.User.updatePassword(uuid,password).then(function(objU){
      console.log("AAAAAAA")
      console.log(objU)
      res.json(objU)
    })


//          .then(function(objU){
//
//          })

});




router.post('/login', function(req, res, next) {

    var password = req.body.password;
    var email = req.body.email;
    db.User.validate(email, password)
          .then(function(validated) {
                var objUser = validated;
                req.session.user = {id: objUser.id,username: objUser.username}

                    if (validated) {

//                    Send welcome Email
                      var sub = "Welcome Email of Real Chat"
                      var html="<h1>Welcome to real chat application</h1>"
                      console.log("email")
                      console.log(email)
                      helpers.mail.sendMail(email,sub,html)

                      res.send({
                                token: jwt.sign({
                                    id: objUser.id,
                                    username: req.body.username,
                                    email:objUser.email,

                                }, jwtSecret),
                                user: {
                                    id: objUser.id,
                                    username: req.body.username,
                                    email:objUser.email,
                                    status:'success'
                      }

                      });
                    }
                          else {
                              return res.send({msg:"Username or password incorrect",status:"error"});
                          }
        });


});



module.exports = router;
