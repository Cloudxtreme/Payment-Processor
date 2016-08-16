angular.module('paymentProcessor')
  .controller('creditTableCtrl', creditTableCtrl)
  .directive('creditTable', creditTableDirective);


function creditTableCtrl ($scope, $modal, creditsManager, loginManager) {
  const viewModel = this;

  /** Directive Variables **/
  viewModel.credits = [];
  viewModel.user = null;


  /** Directive Functions **/
  viewModel.getStatusClass = _getStatusClass;
  viewModel.openModal = _openModal;


  _initController();

  /****** Implementation ******/

  function _initController () {
    creditsManager.getAll().then(credits => viewModel.credits = credits);
    loginManager.getUser().then(user => viewModel.user = user);
  }

  function _getStatusClass (isPaid) {
    return isPaid ? 'status-received' : 'status-owed';
  }

  function _openModal (credit) {
    $modal.open({
      controller: 'ViewCreditCtrl',
      controllerAs: 'viewCreditCtrl',
      templateUrl: 'app/common/modals/view-credit.html',
      size: 'lg',
       resolve: {
        creditObj: () => credit,
        userObj: () => viewModel.user
      }
    });
  }
}

function creditTableDirective () {
  return {
    restrict: 'E',
    scope: {
      credits: '=credits'
    },
    templateUrl: 'app/common/partials/credit-table.partial.html',
    controller: 'creditTableCtrl',
    controllerAs: 'creditTableCtrl'
  };
}
