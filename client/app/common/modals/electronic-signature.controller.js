'use strict';

angular.module('paymentProcessor')
  .controller('ElectronicSignatureCtrl', electronicSignatureCtrl);

function electronicSignatureCtrl ($modalInstance, allSignaturesObj, userObj, electronicSignatureManager) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.allSignatures = allSignaturesObj;
  viewModel.user = userObj;
  viewModel.uploadFile = {};

  /** Modal Functions **/
  viewModel.setUploadFile = _setUploadFile;
  viewModel.chooseMe = _chooseMe;
  viewModel.chooseSomeoneElse = _chooseSomeoneElse;

  _initController();

  /****** Implementation ******/

  function _initController () {

  }

  function _setUploadFile (files) {
    viewModel.uploadFile = files[0];
  }

  function _chooseMe () {
    _createSignatureForSelf();
  }

  function _chooseSomeoneElse () {
    _createSignatureForOther();
  }

  /****** Helpers ******/

  function _createSignatureForSelf () {

    const _openSignModal = (signUrl) => {
      _openHelloSignModal(signUrl);
    };

    const _getSignUrl = (response) => {
      _getSignatureUrl(response.data.signature_request.signatures[0].signature_id).then(_openSignModal);
    };

    _createSignature().then(_getSignUrl);
  }

  function _createSignatureForOther () {
    _createSignature().then((response) => {
      _getSignatureUrl(response.data.signature_request.signatures[0].signature_id).then(() => $modalInstance.close());
    });  
  }

  function _createSignature () {
    return electronicSignatureManager.createSignatureRequest(viewModel.uploadFile);
  }

  function _getSignatureUrl (signatureId) {
    return electronicSignatureManager.getSignatureUrl(signatureId);
  }

  function _openHelloSignModal (signUrl) {
    HelloSign.open({
      url: signUrl,
      allowCancel: true,
      skipDomainVerification: true,
      messageListener: _waitForSignature
    });
  }

  function _waitForSignature (eventData) {
    if (eventData.event === HelloSign.EVENT_SIGNED) {
      $modalInstance.close(5000);
    }
  }
}
