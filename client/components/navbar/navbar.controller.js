'use strict';

function navbarController (loginManager) {
  const viewModel = this;

  /** Controller Variables **/
  viewModel.isCollapsed = null;
  viewModel.loginError = [];
  viewModel.username = '';

  /** Controller Functions **/

  _initController();

  /****** Implementation ******/

  function _initController () {
    const _setUserName = user => {
      viewModel.username = user.firstName;
    };

    loginManager.getUser().then(_setUserName);

    viewModel.isCollapsed = false;
    viewModel.menu = [{
      'title': 'HOME',
      'state': 'dashboard.summary'
    }, {
      'title': 'INCOME',
      'state': 'dashboard.transactions'
    }, {
      'title': 'EXPENDITURE',
      'state': 'dashboard.debts'
    }];
  }
}

angular.module('paymentProcessor')
  .controller('NavbarController', navbarController);
