'use strict';

angular.module('paymentProcessor')
  .controller('SummaryCtrl', summaryCtrl);

function summaryCtrl ($q, loginManager, transactionsManager) {
  const viewModel = this;

  /** Controller Variables **/
  viewModel.transactions = [];
  viewModel.user = null;

  /** Controller Functions **/


  _initController();

  /******** Implementation *******/

  function _initController () {
    const _setExpenditures = (values) => {
      viewModel.user = values[0];
      viewModel.transactions = values[1];
    };

    $q.all([
      loginManager.getUser(),
      transactionsManager.getAll()
    ]).then(_setExpenditures);
  }
}
