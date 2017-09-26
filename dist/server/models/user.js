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
      password: {
        type: DataTypes.STRING(128),
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
            console.log('objU');
            console.log(objU.length)
            if(objU.length){
              return {'status':'error','msg':"Email already exsit."}
            }else{
              return {'status':'success','msg':""}
            }

          })

        },
        validate: function(email, password) {
          console.log("password = ",password)
          var shasum = crypto.createHash('sha1');
          shasum.update(password);
          password = shasum.digest('hex');
          console.log("password")
          console.log(password)
          return User.findOne({
              where: {
                email: email,
                password:password
              }
            })
            .then(function(user) {
              console.log("user")
              console.log(user)
              if (user === undefined || user === null) {
                return false;
              }

              return user

            })

        },
        associate: function(models) {
//          User.belongsToMany(models.Agent, {
//            through: 'mercury_agent_users',
//            foreignKey: 'user_id'
//          });
//          User.belongsToMany(models.Group, {
//            through: 'auth_user_groups',
//            foreignKey: 'user_id'
//          });
//          User.belongsToMany(models.AuthPermission, {
//            through: 'auth_user_user_permissions',
//            foreignKey: 'user_id'
//          });
//
//          User.hasOne(models.UserProfile, {
//            foreignKey: 'user_id'
//          });
//          User.hasOne(models.ClientUser, {
//            foreignKey: 'user_id'
//          });
//          User.hasMany(models.ClientUser, {
//            foreignKey: 'client_id',
//            as: 'SubUsers'
//          });
//          User.hasMany(models.Discount, {
//            foreignKey: 'user_id'
//          });
//          User.hasMany(models.AgentRating, {
//            foreignKey: 'user_id'
//          });
//          User.belongsToMany(models.CorporateAccount, {
//            foreignKey: 'user_id',
//            through: 'mercury_corporateaccount_client'
//          });
//          User.hasMany(models.OrderforService, {
//            foreignKey: 'user_id',
//            as: 'AssociatedQuotes'
//          });
//          User.hasMany(models.OrderforService, {
//            foreignKey: 'subuser_id',
//            as: 'BookedQuotes'
//          });
//          User.hasMany(models.Conversation, {
//            foreignKey: 'author_id'
//          });
//          User.hasMany(models.QuoteDocument, {
//            foreignKey: 'author_id'
//          });
//          User.hasMany(models.QuoteNotication, {
//            foreignKey: 'user_id'
//          });
//          User.hasOne(models.CorporateAccountFee, {
//              foreignKey: 'corporate_account_id'
//              //as: 'NamedUser'
//          });
//          User.hasOne(models.UserLogo, {
//            foreignKey: 'user_id'
//          });
//          User.hasMany(models.MacroCalculatorFiles, {
//            foreignKey: 'user_id'
//          });

        }
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


        getClientNew: function() {
          var client = "";
          return this.getClientUser()
        },

      client :function(){
        return this;
      },

      getClientUser : function(){

      },

      //  getClient: function() {
      //    return this
      //    //    .getUser().then(function(client) {
      //    //
      //    //  console.log("client")
      //    //  console.log(client)
      //    //
      //    //  return client; //.getClient();
      //    //});
      //  },
      //
        getAccounts: function() {
        //var User = this.sequelize.import('../models/user');
        //return this.getUser().then(function(user) {
          return this.getCorporateAccounts({
            include: [{
              model: User,
              as: 'NamedUser'
            }]
          });
        //});
      },
      getDiscountMultiplierByAgentId: function(agentId, shipmentType, serviceType, accountId) {
        //return this.getUser().then(function(user) {
          return this.getDiscounts({
            where: {
              agent_id: agentId
            },
            limit: 1
          //});
        }).then(function(discounts) {
          if (discounts.length) {
            return discounts[0].getDiscountMultiplier(shipmentType, serviceType, accountId);
          }
          return 1;
        });
      }

      }
    });


  return User;
};
