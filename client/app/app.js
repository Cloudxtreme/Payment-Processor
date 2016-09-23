'use strict';

const DEFAULT_ROUTE = '/login';
const HTML5_MODE = true;

const initializeConfiguration = ($urlRouterProvider, $locationProvider, $stateProvider, OAUTH_IO_CLIENT_ID) => {
  $urlRouterProvider.otherwise(DEFAULT_ROUTE);
  $locationProvider.html5Mode(HTML5_MODE);

  // For use with Oauth.io service, and their embedded js in our app
  OAuth.initialize(OAUTH_IO_CLIENT_ID);

  // For use with HelloSign API
  HelloSign.init("b03d1fce1eabf3d0906523817135acbd");

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
    })
    .state('dashboard.incomes', {
      url: '/incomes',
      templateUrl: 'app/dashboard/incomes/incomes.html',
      controller: 'IncomesCtrl',
      controllerAs: 'incomesCtrl'
    })
    .state('dashboard.expenditures', {
      url: '/expenditures',
      templateUrl: 'app/dashboard/expenditures/expenditures.html',
      controller: 'ExpendituresCtrl',
      controllerAs: 'expendituresCtrl'
    })
    .state('dashboard.signatures', {
      url: '/signatures',
      templateUrl: 'app/dashboard/signatures/signatures.html',
      controller: 'SignaturesCtrl',
      controllerAs: 'signaturesCtrl'
    });
};

angular.module('paymentProcessor', [
  'config',
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  "highcharts-ng",
  'ngFileUpload'
])
.config(initializeConfiguration);
