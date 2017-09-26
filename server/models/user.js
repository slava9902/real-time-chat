// Example model
var Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {

  var AuthorizationError = require('../helpers').error.AuthorizationError,
    crypto = require('crypto'),
      User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING(50),
        field: 'username'
      },
      firstName: {
        type: DataTypes.STRING(30),
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING(30),
        field: 'last_name'
      },
      email: {
        type: DataTypes.STRING(75),
        validate: {
          isEmail: true
        }
      },
      uuid: {
        type: DataTypes.STRING(100),
      },
      password: {
        type: DataTypes.STRING(100),
      },
      isStaff: {
        type: DataTypes.BOOLEAN,
        field: 'is_staff'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: 'is_active'
      },
      isSuperuser: {
        type: DataTypes.BOOLEAN,
        field: 'is_superuser'
      },
      lastLogin: {
        type: DataTypes.DATE,
        field: 'last_login'
      },
      dateJoined: {
        type: DataTypes.DATE,
        field: 'date_joined'
      }
    }, {
      tableName: 'auth_user',
      timestamps: false,
      getterMethods: {
        fullName: function() {
          return [this.firstName, this.lastName]
            .filter(function(element) {
              return !!element;
            }).join(' ') || this.username;
        }
      },
      classMethods: {
        checkUserName: function(username) {
          return User.findAll({
            where: {username:username}

          }).then(function(objU){
            console.log('objU');
            console.log(objU.length)
            if(objU.length){
              return {'status':'error','msg':"Username already exsit."}
            }else{
              return {'status':'success','msg':""}
            }

          })

        },
        checkEmail: function(email) {

          return User.findAll({
            where: {email:email}

          }).then(function(objU){

            if(objU.length){
              return {'status':'error','msg':"Email already exsit."}
            }else{
              return {'status':'success','msg':""}
            }

          })

        },


        updatePassword: function(uuid,u_password) {
          var shasum = crypto.createHash('sha1');
          shasum.update(u_password);
          u_password = shasum.digest('hex');

          return User.update(
                  { password: u_password},
                  {
                    where: { uuid: uuid }
                  }

           ).then(function(objU){

          if(objU){

            return {'status':'success','msg':"Password updated successfully."}

          }else{
            return {'status':'error','msg':"Some error occurr."}
          }


          })

        },

        validate: function(email, password) {

          var shasum = crypto.createHash('sha1');
          shasum.update(password);
          password = shasum.digest('hex');

          return User.findOne({
              where: {
                email: email,
                password:password
              }
            })
            .then(function(user) {

              if (user === undefined || user === null) {
                return false;
              }

              return user

            })

        },

      },
      instanceMethods: {

        /**
         * This method resolves the relevant client for given logged in user,
         * Once client is obtained all the operations happen on client
         **/

        add: function(onSuccess, onError) {
          var username = this.username;
          var password = this.password;
          var email = this.email;
          var shasum = crypto.createHash('sha1');
          shasum.update(password);
          password = shasum.digest('hex');

          return User.build({ email:email, username: username, password: password })
            .save().then(function(objUser){
                return objUser;


            });//.success(onSuccess).error(onError);
       },


        getClient: function() {
          var client = "";
          console.log("getClientgetClientgetClient")
          return this.getClientUser().then(function(client) {
            if(client == null){
                client = "";
               //return this.client;
            }else{
              return client.getClient();
            }

          });
        },



      client :function(){
        return this;
      }


      }
    });


  return User;
};
