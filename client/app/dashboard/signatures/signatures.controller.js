'use strict';

angular.module('paymentProcessor')
  .controller('SignaturesCtrl', signaturesCtrl);

function signaturesCtrl ($q, loginManager, electronicSignatureManager) {
  const viewModel = this;

  /** Controller Variables **/
  viewModel.signatureRequests = [];
  viewModel.waitingOnAPI = false;

  /** Controller Functions **/


  _initController();

  /******** Implementation *******/

  function _initController () {
    const _setSignatureRequests = (values) => {
      viewModel.user = values[0];
      viewModel.signatureRequests = values[1];
      viewModel.waitingOnAPI = false;
    };

    viewModel.waitingOnAPI = true;
    $q.all([
      loginManager.getUser(),
      electronicSignatureManager.getSignatureRequests()
    ]).then(_setSignatureRequests);

  }
}
