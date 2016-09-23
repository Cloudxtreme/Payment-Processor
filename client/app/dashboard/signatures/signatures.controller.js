'use strict';

angular.module('paymentProcessor')
  .controller('SignaturesCtrl', signaturesCtrl);

const FILTER_OPTIONS = ['Requested Signatures', 'My Signatures'];

function signaturesCtrl ($q, $modal, loginManager, electronicSignatureManager) {
  const viewModel = this;

  /** Controller Variables **/
  viewModel._allSignatures = [];
  viewModel.filteredSignatureRequests = [];
  viewModel.filterOptions = FILTER_OPTIONS;
  viewModel.selectedFilter = FILTER_OPTIONS[0];
  viewModel.waitingOnAPI = false;

  /** Controller Functions **/
  viewModel.updateDropdown = _updateDropdown;
  viewModel.openNewSignatureModal = _openNewSignatureModal;


  _initController();

  /******** Implementation *******/

  function _initController () {
    const _setSignatureRequests = (values) => {
      viewModel.user = values[0];
      viewModel._allSignatures = values[1];

      _updateDropdown();
      viewModel.waitingOnAPI = false;
    };

    viewModel.waitingOnAPI = true;
    $q.all([
      loginManager.getUser(),
      electronicSignatureManager.getSignatureRequests()
    ]).then(_setSignatureRequests);
  }

  function _updateDropdown () {
    if (_viewRequestedSignatures()) {
      viewModel.filteredSignatures = _getRequestedSignatures();
    } else {
      viewModel.filteredSignatures = _getMySignatures();
    }
  }

  function _openNewSignatureModal () {
    $modal.open({
      controller: 'ElectronicSignatureCtrl',
      controllerAs: 'electronicSignatureCtrl',
      templateUrl: 'app/common/modals/electronic-signature.html',
      size: 'md',
      resolve: {
        allSignaturesObj: () => viewModel._allSignatures,
        userObj: () => viewModel.user
      }
    }).result.then(_refreshSignatures);
  }

  /******** Helpers *******/

  function _viewRequestedSignatures () {
    return viewModel.selectedFilter === FILTER_OPTIONS[0];
  }

  function _getRequestedSignatures () {
    return _.filter(viewModel._allSignatures, _from_signatures);
  }

  function _getMySignatures () {
    return _.filter(viewModel._allSignatures, _to_signatures);
  }

  function _from_signatures (signature) {
    return signature.metadata.from === viewModel.user.email;
  }

  function _to_signatures (signature) {
    return signature.signatures[0].signer_email_address === viewModel.user.email;
  }

  function _refreshSignatures () {
    viewModel.waitingOnAPI = true;

    const _updateSignatures = (signatures) => {
      viewModel._allSignatures = signatures;
      _updateDropdown();
      viewModel.waitingOnAPI = false;
    };
    
    electronicSignatureManager.getSignatureRequests().then(_updateSignatures);
  }
}
