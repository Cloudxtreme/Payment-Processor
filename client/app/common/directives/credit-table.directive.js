angular.module('paymentProcessor')
  .controller('creditTableCtrl', creditTableCtrl)
  .directive('creditTable', creditTableDirective);


function creditTableCtrl ($scope, creditsManager, loginManager) {
  const viewModel = this;

  /** Directive Variables **/
  viewModel.credits = [];
  viewModel.user = null;


  /** Directive Functions **/
  viewModel.getStatusClass = _getStatusClass;


  _initController();

  /****** Implementation ******/

  function _initController () {
    creditsManager.getAll().then(credits => viewModel.credits = credits);
    loginManager.getUser().then(user => viewModel.user = user);
  }

  function _getStatusClass (isPaid) {
    return isPaid ? 'status-received' : 'status-owed';
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
