'use strict';

app.factory('AuthService', ["$http", "$q", "$window", //"Upload",

    function ($http, $q, $window) {


        var authenticate = function (userDetails) {

            //
            var deferred = $q.defer();
            var url = '/api/user/login/';

            console.log("userDetails")
            console.log(userDetails);
            $http({
                url: url,
                method: 'POST',
                data: userDetails,
                header: {'Content-Type': 'form-data'}
            })
                .then(function (response) {
                    console.log("response.data.token")
                    console.log(response)

                    var token = response.data.token;


                    if (token) {
                        $window.localStorage.setItem("auth-token",token)



                        deferred.resolve(response);

                    }
                    else {
                        deferred.reject("Wrong email or password");
                    }
                },
                function (response) {

                    if (response.data.non_field_errors == 'User account is disabled.') {
                        deferred.reject("account is disabled");
                    } else {
                        deferred.reject("Wrong email or password");
                    }

                });


            return deferred.promise;


        };

        var logout = function () {
            console.log("logout")
            var deferred = $q.defer();
            var url = '/api/user/logout';


//            $http.post(url)
            $http({
                url: url,
                method: 'POST',
                data:{},
                header: {'Content-Type': 'form-data'}
            })

            .then(
                function (response) {
                    $window.localStorage.removeItem('auth-token');

                    deferred.resolve();
                },
                function (error) {
                    deferred.reject(error.data.error);
                }
            );
            return deferred.promise;
        };


        var register = function (userDetails) {
            console.log("userDetails Service");
            console.log(userDetails)
            var deferred = $q.defer();
            var url = '/api/user/register';


            $http({
                url: url,
                method: "POST",
                data: userDetails,

            })
                .then(function (response) {


                    deferred.resolve(response.data);

                },
                function (response) {
                    //deferred.reject(response.data.meessage);
                    deferred.reject('Invalid data received from server');
                });

            return deferred.promise;
        };


        var forgotPassword = function (userDetails) {
            console.log("userDetails Service");
            console.log(userDetails)
            var deferred = $q.defer();
            var url = '/api/user/forgot-password';


            $http({
                url: url,
                method: "POST",
                data: userDetails,

            })
                .then(function (response) {


                    deferred.resolve(response.data);

                },
                function (response) {
                    //deferred.reject(response.data.meessage);
                    deferred.reject('Invalid data received from server');
                });

            return deferred.promise;
        };


        var resetPassword = function (userDetails) {
            console.log("userDetails Service");
            console.log(userDetails)
            var deferred = $q.defer();
            var url = '/api/user/reset-password';


            $http({
                url: url,
                method: "POST",
                data: userDetails,

            })
                .then(function (response) {


                    deferred.resolve(response.data);

                },
                function (response) {
                    //deferred.reject(response.data.meessage);
                    deferred.reject('Invalid data received from server');
                });

            return deferred.promise;
        };


        var getUser = function () {

            var url = '/api/user/me';
            var deferred = $q.defer();
            console.log("!!!!!@@211111")
            return $window.localStorage.getItem("auth-token") ? $http({
                                  url: url, method: 'GET',}) : $q.resolve({
                  data :{msg:"Not Authorized",status:'login'}
                });

        };




        return {
            register: function (userDetails) {
                return register(userDetails);
            },
            login: function (userDetails) {
                return authenticate(userDetails);
            },
            forgotPassword: function (userDetails) {
                return forgotPassword(userDetails);
            },
            getUser: function () {
                return getUser();
            },
//
            logout: function () {
                return logout();
            },
            resetPassword: function(userDetails){
                return resetPassword(userDetails);
            }



        };

    }])



//.factory('socket', function ($rootScope) {
//  var socket = io.connect();
//  return {
//    on: function (eventName, callback) {
//      socket.on(eventName, function () {
//        var args = arguments;
//        $rootScope.$apply(function () {
//          callback.apply(socket, args);
//        });
//      });
//    },
//    emit: function (eventName, data, callback) {
//      socket.emit(eventName, data, function () {
//        var args = arguments;
//        $rootScope.$apply(function () {
//          if (callback) {
//            callback.apply(socket, args);
//          }
//        });
//      })
//    }
//  };
//});
