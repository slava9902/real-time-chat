'use strict';

var express = require('express');

var bcrypt = require('bcryptjs');
var router = express.Router();
var db = require('../../models');
var jwtSecret = require('../../config/environment/index').jwtSecret;
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens


router.get('/me', function(req, res) {
    console.log("meee")
    console.log(req.session.user)
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

                  if(objUE.status == 'email_unavailable'){
                      user.add().then(function(objUser){

                        console.log(objUser)
                        req.session.user = {id: objUser.id,username: req.body.username}
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

router.post('/login', function(req, res, next) {


    var password = req.body.password;
    var email = req.body.email;



    console.log("Login function")
    console.log(email)

    console.log(password)
    db.User.validate(email, password)
          .then(function(validated) {
                console.log("LLLLLAAAA");
                console.log(validated)
                var objUser = validated;
                req.session.user = {id: objUser.id,username: objUser.username}

                    if (validated) {
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
                              return res.send("Username or password incorrect");
                              //return res.status(401).end('Username or password incorrect');
                          }
        });


});



module.exports = router;
