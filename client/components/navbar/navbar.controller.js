'use strict';

function navbarController (loginManager, transactionsManager, $state, $modal, stripeInfoManager) {
  const viewModel = this;

  /** Controller Variables **/
  viewModel.isCollapsed = null;
  viewModel.menu = [];
  viewModel.loginError = [];
  viewModel.username = '';
  viewModel.waitingOnIntegration = false;

  /** Controller Functions **/
  viewModel.syncUser = _syncUser;
  viewModel.logout = _logout;

  _initController();

  /****** Implementation ******/

  function _initController () {
    const _setUserName = user => {
      if (user) {
        viewModel.user = user;
        viewModel.username = user.firstName;
        viewModel.synced = Boolean(user.stripeInfo && user.stripeInfo.accessToken);
        viewModel.menu = [{
          'title': 'HOME',
          'state': 'dashboard.summary'
        }, {
          'title': 'INCOME',
          'state': 'dashboard.incomes'
        }, {
          'title': 'EXPENDITURE',
          'state': 'dashboard.expenditures'
        }, {
          'title': 'SIGNATURE',
          'state': 'dashboard.signatures'
        }];
      }
    };

    loginManager.getUser().then(_setUserName);
    viewModel.isCollapsed = false;
  }

  function _logout () {
    stripeInfoManager.deleteInfo(viewModel.user.id, loginManager.getToken());
    transactionsManager.flush();
    loginManager.logout();
    $state.go('login');
  }

  function _syncUser () {
    if (viewModel.waitingOnIntegration) {
      return;
    }

    if (viewModel.synced) {
      viewModel.user.stripeInfo = {};
      viewModel.synced = false;

      return;
    }

    const _handleIntegrationSuccess = (result) => {
      // Setup user's stripe data
      _.assign(
        viewModel.user.stripeInfo,
        {
          accessToken: result.access_token,
          publishableKey: result.stripe_publishable_key,
          stripeUserId: result.stripe_user_id
        }
      );

      // Send stripe data to server
      stripeInfoManager.createInfo(viewModel.user.id, viewModel.user.stripeInfo, loginManager.getToken());

      viewModel.waitingOnIntegration = false;
      viewModel.synced = true;
    };

    const _handleIntegrationFailure = () => {
      _loadIntegrationFailureModal();
      viewModel.waitingOnIntegration = false;
    };

    viewModel.waitingOnIntegration = true;

    // Send then to stripe's website
    OAuth.popup('stripe')
      .done(_handleIntegrationSuccess)
      .fail(_handleIntegrationFailure);
  }

  function _loadIntegrationFailureModal () {
    return $modal.open({
      controller: 'NotificationCtrl',
      controllerAs: 'notificationCtrl',
      templateUrl: 'app/common/modals/notification.html',
      size: 'sm',
      resolve: {
        type: () => 'error',
        message: () => 'Integration Failed',
        details: () => 'Our attempt to integrate your stripe account into our system failed. This most likely occured because of an invalid login attempt on stripe\'s website'
      }
    });
  }
}

angular.module('paymentProcessor')
  .controller('NavbarController', navbarController);
