'use strict';

angular.module('App')
  .config(function ($stateProvider,$qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/view/home.html',
        controller: 'HomeCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/main/view/login.html',
        controller: 'LoginCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'app/main/view/register.html',
        controller: 'RegisterCtrl',
      })
      .state('forgotPassword', {
        url: '/forgot-password',
        templateUrl: 'app/main/view/forgot_password.html',
//        controller: 'RegisterCtrl',
      })
      .state('resetPassword', {
        url: '/reset-password/:uuid',
        templateUrl: 'app/main/view/reset_password.html',
        controller: 'resetPasswordCtrl',
      });


  });
