'use strict';

angular.module('paymentProcessor')
  .controller('ViewTransactionCtrl', viewTransactionCtrl);

function viewTransactionCtrl ($modalInstance, transactionObj, userObj) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.transaction = transactionObj;
  viewModel.user = userObj;

  /** Modal Functions **/
  viewModel.pay = _pay;
  viewModel.requestPayment = _requestPayment;
  viewModel.shouldDisableButton = _shouldDisableButton;

  _initController();

  /****** Implementation ******/

  function _initController () {

  }

  function _pay () {
    if (!_shouldDisableButton()) {
      $modalInstance.close();
    }
  }

  function _requestPayment () {
    if (!_shouldDisableButton()) {
      // TODO: Send email or something
      $modalInstance.dismiss();
    }
  }

  function _shouldDisableButton () {
    return viewModel.transaction.isPaid();
  }
}

