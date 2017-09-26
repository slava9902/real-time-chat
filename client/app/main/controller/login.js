'use strict';

angular.module('App')
  .controller('LoginCtrl', function ($scope, $http,AuthService,$window) {
    $scope.awesomeThings = [];
    $scope.loginUser = function(){

      AuthService.login($scope.user).then(function(resp){

        if(resp.data.user.status=="success"){
          $window.location.href = "/"
        }

      });


    }

  });
