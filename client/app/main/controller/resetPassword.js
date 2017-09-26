'use strict';

angular.module('App')
  .controller('resetPasswordCtrl', function ($scope,AuthService,$stateParams,$location,$mdToast) {
    $scope.awesomeThings = [];
    console.log("SSSSSSSSS")
    console.log($stateParams.uuid)


    $scope.resetPassword = function(){

      $scope.user.uuid = $stateParams.uuid;
      $scope.error_msg=null;
      AuthService.resetPassword($scope.user).then(function(resp){
      console.log(resp)
        if(resp.status == 'success'){
          var type="success";
          var msg = "Password reset successfully."
          $mdToast.show({
              template: '<md-toast class="md-toast-'+ type +'"> <ng-md-icon icon="done"></ng-md-icon> ' + msg + '</md-toast>',
              hideDelay: 5000,
              position: 'top right'
          });
          $location.path('/login');
        }else{

           $scope.error_msg=resp.msg;

        }

      });


    }

  });
