angular.module('paymentProcessor')
  .controller('transactionTableCtrl', transactionTableCtrl)
  .directive('transactionTable', transactionTableDirective);


function transactionTableCtrl ($scope, $modal, transactionsManager, loginManager) {
  const viewModel = this;

  /** Directive Variables **/
  viewModel.transactions = [];
  viewModel.user = null;

  /** Directive Functions **/
  viewModel.getStatusClass = _getStatusClass;
  viewModel.openModal = _openModal;


  _initController();

  /****** Implementation ******/

  $scope.$watch('transactions', () => {
    viewModel.transactions = $scope.transactions;
  });

  function _initController () {
    loginManager.getUser().then(user => viewModel.user = user);
  }

  function _getStatusClass (isPaid) {
    return isPaid ? 'status-received' : 'status-owed';
  }

  function _openModal (transaction) {
    $modal.open({
      controller: 'ViewTransactionCtrl',
      controllerAs: 'viewTransactionCtrl',
      templateUrl: 'app/common/modals/view-transaction.html',
      size: 'lg',
       resolve: {
        transactionObj: () => transaction,
        userObj: () => viewModel.user
      }
    });
  }
}

function transactionTableDirective () {
  return {
    restrict: 'E',
    scope: {
      transactions: '='
    },
    templateUrl: 'app/common/partials/transaction-table.partial.html',
    controller: 'transactionTableCtrl',
    controllerAs: 'transactionTableCtrl'
  };
}
