angular.module('paymentProcessor')
  .controller('creditTableCtrl', creditTableCtrl)
  .directive('creditTable', creditTableDirective);


function creditTableCtrl ($scope, creditsManager) {
  const viewModel = this;

  /** Directive Variables **/
  viewModel.credits = $scope.credits;

  /** Directive Functions **/


  _initController();

  /****** Implementation ******/

  function _initController () {
    creditsManager.getAll().then(credits => viewModel.credits = credits);
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
