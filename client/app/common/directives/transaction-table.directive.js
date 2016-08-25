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
  viewModel.getStatusText = _getStatusText;
  viewModel.openModal = _openModal;


  _initController();

  /****** Implementation ******/

  $scope.$watch('transactions', () => {
    viewModel.transactions = $scope.transactions;
  });
  $scope.$watch('user', () => {
    viewModel.user = $scope.user;
  });

  function _initController () {
    loginManager.getUser().then(user => viewModel.user = user);
  }

  function _getStatusClass (transaction) {
    if (transaction.isAnIncome(viewModel.user.id)) {
      return transaction.isPaid() ? 'status-received' : 'status-owed';
    } else {
      return transaction.isPaid() ? 'status-paid' : 'status-unpaid';
    }
  }

  function _getStatusText (transaction) {
    if (transaction.isAnIncome(viewModel.user.id)) {
      return transaction.isPaid() ? 'RECEIVED' : 'OWED';
    } else {
      return transaction.isPaid() ? 'PAID' : 'UNPAID';
    }
  }

  function _openModal (transaction) {
    const modalInstance = $modal.open({
      controller: 'ViewTransactionCtrl',
      controllerAs: 'viewTransactionCtrl',
      templateUrl: 'app/common/modals/view-transaction.html',
      size: 'lg',
       resolve: {
        transactionObj: () => transaction,
        userObj: () => viewModel.user
      }
    });

    modalInstance.result.then(() => {
      $modal.open({
        controller: 'ProcessPaymentCtrl',
        controllerAs: 'processPaymentCtrl',
        templateUrl: 'app/common/modals/process-payment.html',
        size: 'lg',
        resolve: {
          transactionObj: () => transaction,
          userObj: () => viewModel.user
        }
      });
    });
  }
}

function transactionTableDirective () {
  return {
    restrict: 'E',
    scope: {
      transactions: '=',
      user: '='
    },
    templateUrl: 'app/common/partials/transaction-table.partial.html',
    controller: 'transactionTableCtrl',
    controllerAs: 'transactionTableCtrl'
  };
}
