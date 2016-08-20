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

  _initController();

  /****** Implementation ******/

  function _initController () {

  }

  function _pay () {
    $modalInstance.dismiss();
  }

  function _requestPayment () {
    $modalInstance.dismiss();
  }
}

