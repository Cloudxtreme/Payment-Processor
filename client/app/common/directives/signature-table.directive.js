angular.module('paymentProcessor')
  .controller('signatureTableCtrl', signatureTableCtrl)
  .directive('signatureTable', signatureTableDirective);


function signatureTableCtrl ($scope, $modal) {
  const viewModel = this;

  /** Directive Variables **/
  viewModel.signatureRequests = [];
  viewModel.user = null;

  /** Directive Functions **/
  viewModel.getSignedAt = _getSignedAt;
  viewModel.getStatusClass = _getStatusClass;
  viewModel.getStatusText = _getStatusText;
  viewModel.openSignature = _openSignature;


  _initController();

  /****** Implementation ******/

  $scope.$watch('signatures', () => {
    viewModel.signatureRequests = $scope.signatures;
  });
  $scope.$watch('user', () => {
    viewModel.user = $scope.user;
  });

  function _initController () {
  }

  function _getSignedAt (signatureRequest) {
    return signatureRequest.is_complete ? new Date(signatureRequest.signatures[0].signed_at * 1000) : '';
  }

  function _getStatusClass (signatureRequest) {
    return signatureRequest.is_complete ? 'status-paid' : 'status-unpaid';
  }

  function _getStatusText (signatureRequest) {
    return signatureRequest.is_complete ? 'SIGNED' : 'UNSIGNED';
  }

  function _openSignature (signatureRequest) {
    if (signatureRequest.is_complete) {
      $modal.open({
        controller: 'ViewSignatureCtrl',
        controllerAs: 'viewSignatureCtrl',
        templateUrl: 'app/common/modals/view-signature.html',
        size: 'lg',
        resolve: {
          signatureObj: () => signatureRequest,
          userObj: () => viewModel.user
        }
      });
    } else {
      // Open Hello Sign  
      // Then update signatures
    }
  }
}

function signatureTableDirective () {
  return {
    restrict: 'E',
    scope: {
      signatures: '=',
      user: '='
    },
    templateUrl: 'app/common/partials/signature-table.partial.html',
    controller: 'signatureTableCtrl',
    controllerAs: 'signatureTableCtrl'
  };
}
