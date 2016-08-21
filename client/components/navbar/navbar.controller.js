'use strict';

function navbarController (loginManager) {
  const viewModel = this;

  /** Controller Variables **/
  viewModel.isCollapsed = null;
  viewModel.menu = [];
  viewModel.loginError = [];
  viewModel.username = '';

  /** Controller Functions **/

  _initController();

  /****** Implementation ******/

  function _initController () {
    const _setUserName = user => {
      if (user) {
        viewModel.username = user.firstName;
        viewModel.menu = [{
          'title': 'HOME',
          'state': 'dashboard.summary'
        }, {
          'title': 'INCOME',
          'state': 'dashboard.incomes'
        }, {
          'title': 'EXPENDITURE',
          'state': 'dashboard.expenditures'
        }];
      }
    };

    loginManager.getUser().then(_setUserName);
    viewModel.isCollapsed = false;
  }
}

angular.module('paymentProcessor')
  .controller('NavbarController', navbarController);
