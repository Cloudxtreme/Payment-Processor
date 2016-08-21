'use strict';

angular.module('paymentProcessor')
  .controller('SummaryCtrl', summaryCtrl);

function summaryCtrl ($scope, $q, loginManager, transactionsManager, chartBuilder) {
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

      const _isPaid = (transaction) => transaction.isPaid();
      const _isNotPaid = (transaction) => !transaction.isPaid();
      const _sumTransactionAmounts = (sum, transaction) => sum + transaction.amount();

      const _calculateReceivedIncomesAmount = (transactions) => _.reduce(_.filter(transactionsManager.thatAreIncomes(viewModel.user.id, transactions), _isPaid), _sumTransactionAmounts, 0);
      const _calculateOwedIncomesAmount = (transactions) => _.reduce(_.filter(transactionsManager.thatAreIncomes(viewModel.user.id, transactions), _isNotPaid), _sumTransactionAmounts, 0);
      const _calculatePaidExpendituresAmount = (transactions) => _.reduce(_.filter(transactionsManager.thatAreExpenditures(viewModel.user.id, transactions), _isPaid), _sumTransactionAmounts, 0);
      const _calculateUnpaidExpendituresAmount = (transactions) => _.reduce(_.filter(transactionsManager.thatAreExpenditures(viewModel.user.id, transactions), _isNotPaid), _sumTransactionAmounts, 0);

      viewModel.receivedIncomes = _calculateReceivedIncomesAmount(viewModel.transactions);
      viewModel.owedIncomes = _calculateOwedIncomesAmount(viewModel.transactions);
      viewModel.paidExpenditures = _calculatePaidExpendituresAmount(viewModel.transactions);
      viewModel.unpaidExpenditures = _calculateUnpaidExpendituresAmount(viewModel.transactions);

      viewModel.barGraph = chartBuilder.buildHorizontalBarGraph(viewModel.receivedIncomes, viewModel.paidExpenditures);
      viewModel.incomeGraph = chartBuilder.buildIncomeDonutGraph(viewModel.receivedIncomes, viewModel.owedIncomes);
      viewModel.expenditureGraph = chartBuilder.buildExpenditureDonutGraph(viewModel.paidExpenditures, viewModel.unpaidExpenditures);
    };

    viewModel.barGraph = chartBuilder.buildHorizontalBarGraph(0, 0);// This vars need to have an
    viewModel.incomeGraph = chartBuilder.buildIncomeDonutGraph(0, 0);// initial state set, for the graphs
    viewModel.expenditureGraph = chartBuilder.buildExpenditureDonutGraph(0, 0);

    $q.all([
      loginManager.getUser(),
      transactionsManager.getAll()
    ]).then(_setExpenditures);
  }
}
