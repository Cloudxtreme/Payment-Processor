'use strict';

const DEFAULT_ROUTE = '/login';
const HTML5_MODE = true;

const initializeConfiguration = ($urlRouterProvider, $locationProvider, $stateProvider) => {
  $urlRouterProvider.otherwise(DEFAULT_ROUTE);
  $locationProvider.html5Mode(HTML5_MODE);

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
    .state('dashboard.credits', {
      url: '/credits',
      templateUrl: 'app/dashboard/credits/credits.html',
      controller: 'CreditsCtrl',
      controllerAs: 'creditsCtrl'
    });

};

angular.module('paymentProcessor', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap'
])
.config(initializeConfiguration);


