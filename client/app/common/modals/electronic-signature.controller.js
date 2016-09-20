'use strict';

angular.module('paymentProcessor')
  .controller('ElectronicSignatureCtrl', electronicSignatureCtrl);

function electronicSignatureCtrl ($modalInstance, electronicSignatureManager) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.signatureRequests = [];

  /** Modal Functions **/
  viewModel.requestSignature = _requestSignature;

  _initController();

  /****** Implementation ******/

  function _initController () {
    const _setSignatureRequests = (signatureRequests) => {
      viewModel.signatureRequests = signatureRequests;
    };

    electronicSignatureManager.getSignatureRequests().then(_setSignatureRequests);
  }

  function _requestSignature () {
  }
}
