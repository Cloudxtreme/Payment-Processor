'use strict';

angular.module('paymentProcessor')
  .controller('NotificationCtrl', notificationCtrl);

function notificationCtrl ($modalInstance, message) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.message = message;

  /** Modal Functions **/

  _initController();

  /****** Implementation ******/

  function _initController () {

  }
}

