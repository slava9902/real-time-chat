'use strict';

app.controller('RegisterCtrl', function ($scope, $http, AuthService,$mdToast,$location) {
    $scope.awesomeThings = [];
    $scope.user={};
    $scope.error_msg=null

    $scope.registerUser =  function(){
        $scope.error_msg=null
        AuthService.register($scope.user).then(function (resp){

        if(resp.status=='success'){

          var type="success";
          var msg = "Account created successfully."
          $mdToast.show({
                template: '<md-toast class="md-toast-'+ type +'"> <ng-md-icon icon="done"></ng-md-icon> ' + msg + '</md-toast>',
                hideDelay: 5000,
                position: 'top right'
            });
          $location.path('/login');
        }else{

          $scope.error_msg=resp.msg;
        }


        })
    }

});
