angular.module('paymentProcessor')
  .controller('signatureTableCtrl', signatureTableCtrl)
  .directive('signatureTable', signatureTableDirective);


function signatureTableCtrl ($scope, $q, $modal, electronicSignatureManager) {
  const viewModel = this;

  /** Directive Variables **/
  viewModel.signatureRequests = [];
  viewModel.user = null;

  /** Directive Functions **/
  viewModel.getSignedAt = _getSignedAt;
  viewModel.getStatusClass = _getStatusClass;
  viewModel.getStatusText = _getStatusText;
  viewModel.openSignature = _openSignature;
  viewModel.refreshSignatures = $scope.refresh;


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
    if (signatureRequest.is_complete || _userIsNotSigner(signatureRequest)) {
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
      const _openSignModal = (signUrl) => {
        _openHelloSignModal(signUrl).then(() => viewModel.refreshSignatures({milliseconds: 10000}));
      };

      electronicSignatureManager.getSignatureUrl(signatureRequest.signatures[0].signature_id).then(_openSignModal);
    }
  }

  function _openHelloSignModal (signUrl) {
    const deferred = $q.defer();

    const _waitForSignature = (eventData) => {
      if (eventData.event === HelloSign.EVENT_SIGNED) {
        deferred.resolve();
      }
    };

    HelloSign.open({
      url: signUrl,
      allowCancel: true,
      skipDomainVerification: true,
      messageListener: _waitForSignature
    });

    return deferred.promise;
  }

  function _userIsNotSigner (signature) {
    return viewModel.user.email !== signature.signatures[0].signer_email_address; 
  }
}

function signatureTableDirective () {
  return {
    restrict: 'E',
    scope: {
      signatures: '=',
      user: '=',
      refresh: '&'
    },
    templateUrl: 'app/common/partials/signature-table.partial.html',
    controller: 'signatureTableCtrl',
    controllerAs: 'signatureTableCtrl'
  };
}
