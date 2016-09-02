'use strict';

angular.module('paymentProcessor')
  .controller('NotificationCtrl', notificationCtrl);

function notificationCtrl ($modalInstance, type, message, details) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.type = type || 'info';
  viewModel.message = message || '';
  viewModel.details = details || '';
  viewModel.iconClass = "";

  /** Modal Functions **/

  _initController();

  /****** Implementation ******/

  function _initController () {
    viewModel.iconClass = _getIconClass(viewModel.type);
  }

  /****** Implementation ******/

  function _getIconClass (notificationType) {
    switch (notificationType) {
      case 'info':
        return 'fa-info';
      case 'warning':
        return 'fa-exclamation';
      case 'error':
        return 'fa-times';
      default:
        return 'fa-info';
    }
  }

}

