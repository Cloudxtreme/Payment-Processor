'use strict';

angular.module('paymentProcessor')
  .controller('DashboardCtrl', dashboardCtrl);


function dashboardCtrl (loginManager) {
  const viewModel = this;

  /** Controller Variables **/
  viewModel.username = '';


  /** Controller Functions **/


  _initController();

  /******** Implementation *******/

  function _initController () {
    const _setUserName = user => {
      viewModel.username = user.firstName;
    };

    loginManager.getUser().then(_setUserName);
  }
}
