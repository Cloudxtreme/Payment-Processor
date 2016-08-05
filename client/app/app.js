'use strict';

angular.module('paymentProcessor', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap'
])
.config(function($urlRouterProvider, $locationProvider, $stateProvider) {
  $urlRouterProvider
    .otherwise('/login');

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'loginCtrl'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashboardCtrl',
      controllerAs: 'dashboardCtrl'
    })
    .state('dashboard.summary', {
      url: '/summary',
      templateUrl: 'app/dashboard/summary/summary.html',
      controller: 'SummaryCtrl',
      controllerAs: 'summaryCtrl'
    });
});
