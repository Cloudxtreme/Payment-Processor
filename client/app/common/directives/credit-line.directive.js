angular.module('paymentProcessor')
  .controller('creditLineCtrl', creditLineCtrl)
  .directive('creditLine', creditLineDirective);


function creditLineCtrl ($scope, $modal) {
  const viewModel = this;

  /** Directive Variables **/
  viewModel.credit = $scope.credit;
  viewModel.user = $scope.user;

  /** Directive Functions **/
  viewModel.openModal = _openModal;


  _initController();

  /****** Implementation ******/

  function _initController () {

  }

  function _openModal () {
    $modal.open({
      controller: 'ViewCreditCtrl',
      controllerAs: 'viewCreditCtrl',
      templateUrl: 'app/common/modals/view-credit.html',
      size: 'lg'
    });
  }
}

function creditLineDirective () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      credit: '=credit',
      user: '=user'
    },
    templateUrl: 'app/common/partials/credit-line.partial.html',
    controller: 'creditLineCtrl',
    controllerAs: 'creditLineCtrl'
  };
}
