'use strict';

angular.module('paymentProcessor')
  .controller('DashboardCtrl', dashboardCtrl);

function dashboardCtrl($scope, $state, loginManager) {
  loginManager.redirectIfNotLoggedIn();

  /*jshint validthis: true */
  var viewModel = this;

  /** Controller Variables **/
  viewModel.currentUser = 'User not logged in';

  /** Controller Functions **/
  viewModel.goTo = _goTo;


  _initController();

  /******** Implementation *******/

  function _initController() {
    loginManager.getUser().then(function(username) {
      viewModel.currentUser = username.fullname;
    });
  }

  function _goTo(goTo) {
    $state.go(goTo);
  }
}
