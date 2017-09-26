'use strict';

angular.module('App')
  .controller('HomeCtrl', function ($scope, AuthService, $rootScope,$window,$location,chatSocket,$log) {
    $scope.awesomeThings = [];
    $scope.sendMessage =function(){
      console.log($scope.textMessage)
      chatSocket.emit('message', $scope.loggedInUser.username, $scope.textMessage);
      $scope.textMessage=null;
    }

    $scope.messages=[]
    $scope.$on('socket:broadcast', function(event, data) {
//    $log.debug('got a message', event.name);
    console.log(data)
    $scope.messages.push(data)
//    if (!data.payload) {
//      $log.error('invalid message', 'event', event,
//                 'data', JSON.stringify(data));
//      return;
//    }
//    $scope.$apply(function() {
//      $scope.messageLog = messageFormatter(
//            new Date(), data.source,
//            data.payload) + $scope.messageLog;
//    });
  });
 // end of controller

    console.log("$rootScope.loggedInUser.status")
    console.log($scope.loggedInUser)


    if($rootScope.loggedInUser.status === 'login'){
        window.location.href = "/login"
    }

  });
