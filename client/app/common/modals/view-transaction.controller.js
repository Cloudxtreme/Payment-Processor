'use strict';

angular.module('paymentProcessor')
  .controller('ViewTransactionCtrl', viewTransactionCtrl);

function viewTransactionCtrl (transactionObj, userObj) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.transaction = transactionObj;
  viewModel.user = userObj;


  /** Modal Functions **/

  _initController();

  /****** Implementation ******/

  function _initController () {

  }
}

