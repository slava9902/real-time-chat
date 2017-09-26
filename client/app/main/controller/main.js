'use strict';

angular.module('App')
  .controller('MainCtrl', function ($scope, AuthService, $rootScope,$window,
                                    $location,$mdToast) {
    $scope.awesomeThings = [];

    $scope.user={}
    $rootScope.loginedUser=null;
    console.log("SSSSSSSSS AAAAAAAA")
    AuthService.getUser()
        .then(function(user){
            console.log("user")
            console.log(user)
            $rootScope.loggedInUser = user.data

//            if(user.status !== 'login' && window.location.pathname==='/login'){
//                window.location.href = "/"
//
//            }


            console.log($rootScope.loggedInUser)

        })

    $scope.logOut = function(){
        AuthService.logout().then(function(resp){
         console.log("logout successfully")
          console.log(resp)

//            $location.path("/login")
            $window.location.href = "/login"

        });
    }


    $scope.forgotPassword = function(){
        console.log("user")
        console.log($scope.user)
        AuthService.forgotPassword($scope.user).then(function(resp){
        console.log("logout successfully")
        console.log(resp)
        if(resp.status == 'success'){
            var type="sucess";
            var msg = "I have sent you reset password mail.<br/> Please check your email."
            $mdToast.show({
                  template: '<md-toast class="md-toast-'+ type +'"> <ng-md-icon icon="done"></ng-md-icon> ' + msg + '</md-toast>',
                  hideDelay: 5000,
                  position: 'top right'
              });
        }

//            $location.path("/login")


        });
    }






  });
