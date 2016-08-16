'use strict';

angular.module('paymentProcessor')
  .controller('ViewCreditCtrl', viewCreditCtrl);

function viewCreditCtrl (creditObj, userObj) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.credit = creditObj;
  viewModel.user = userObj;


  /** Modal Functions **/

  _initController();

  /****** Implementation ******/

  function _initController () {

  }
}

