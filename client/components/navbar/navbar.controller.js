'use strict';

function navbarController() {
  var viewModel = this;

  /** Controller Variables **/
  viewModel.isCollapsed = null;
  viewModel.loginError = [];

  /** Controller Functions **/


  _initController();
  
  /****** Implementation ******/

  function _initController() {
    viewModel.isCollapsed = false;
    viewModel.menu = [{
      'title': 'Overview',
      'state': 'dashboard.summary'
    }, {
      'title': 'Credits',
      'state': 'dashboard.credits'
    }, {
      'title': 'Debts',
      'state': 'dashboard.debts'
    }];
  }
}

angular.module('paymentProcessor')
  .controller('NavbarController', navbarController);
