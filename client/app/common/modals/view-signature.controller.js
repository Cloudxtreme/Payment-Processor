'use strict';

angular.module('paymentProcessor')
  .controller('ViewSignatureCtrl', viewSignatureCtrl);

function viewSignatureCtrl ($scope, $sce, $modalInstance, signatureObj, userObj, electronicSignatureManager) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.signature = signatureObj;
  viewModel.user = userObj;

  /** Modal Functions **/
  viewModel.close = _close;
  viewModel.getSignedAt = _getSignedAt;

  _initController();

  /****** Implementation ******/

  function _initController () {
    const _setContent = (response) => {
      var file = new Blob([(response)], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
      $scope.content = $sce.trustAsResourceUrl(fileURL);
    };

    electronicSignatureManager.getSignedFile(viewModel.signature.files_url).then(_setContent);
  }

  function _close () {
    $modalInstance.close();
  }
  
  function _getSignedAt () {
    return viewModel.signature.is_complete ? new Date(viewModel.signature.signatures[0].signed_at * 1000) : '';
  }

  /****** Helpers ******/

}
