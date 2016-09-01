'use strict';

angular.module('paymentProcessor')
  .controller('ProcessPaymentCtrl', processPaymentCtrl);

const MILLISECONDS_IN_MICROSECONDS = 1000;
const BUTTON_TEXT = ['Review Order', 'Review Payment', 'Confirm Payment', 'Exit'];

// TODO: Make button in navbar to allow user to connect to stripe
// TODO: Make logout in navbar

function processPaymentCtrl ($q, $modal, $modalInstance, transactionObj, userObj, stripeInfoManager, loginManager, transactionsManager, paymentManager, Card, Source, Destination, Charge) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.transaction = transactionObj;
  viewModel.user = userObj;
  viewModel.step = 1;
  viewModel.buttonText = 'Review Charge';
  viewModel.waitingOnAPI = false;

  // Absolutly imperitive that we wipe these out on open
  viewModel.accessToken = null;         // Step 1
  viewModel.source = null;              // Step 2
  viewModel.card = {};
  viewModel.destination = null;         // Step 3
  viewModel.charge = null;              // Step 4

  /** Modal Functions **/
  viewModel.exit = _exit;
  viewModel.nextButtonClick = _nextButtonClick;
  viewModel.editCardInfo = _editCardInfo;
  viewModel.shouldDisableNextButton = _shouldDisableNextButton;
  viewModel.hasInvalidCardNumber = _hasInvalidCardNumber;
  viewModel.hasInvalidCardExpMonth = _hasInvalidCardExpMonth;
  viewModel.hasInvalidCardExpYear = _hasInvalidCardExpYear;
  viewModel.hasInvalidCardCvc = _hasInvalidCardCvc;


  _initController();

  /****** Implementation ******/

  function _initController () {
    const _handleDoesHaveDestination = destination => {
      viewModel.destination = destination;
      _executeStep1();
    };

    const _handleDoesNotHaveDestination = () => {
      _loadNoDestinationStripeAccountModal().result.then(_exit);
    };

    transactionsManager.getDestination(viewModel.transaction)
      .then(_handleDoesHaveDestination, _handleDoesNotHaveDestination);
  }

  function _executeStep1 () {
    _getStripeAccessToken(viewModel.user).then(accessToken => {
        viewModel.accessToken = accessToken;
        _incrementStep();
        _initStep2();
    }, () => _exit());
  }

  function _initStep2 () {
    // TODO: Someday, Hit Stripe API for Payment Sources

    viewModel.card = {};
  }

  function _executeStep2 () {
    const _setSourceAndNextStep = (tokenObj) => {
      viewModel.source = new Source(tokenObj);
      _incrementStep();
      _initStep3();
      viewModel.waitingOnAPI = false;
    };

    const _handleInvalidSource = () => {
      _loadInvalidCardInfoModal().result.then(() => viewModel.waitingOnAPI = false);
    };

    if (_hasValidCardInfo()) {
      paymentManager.createToken(new Card(viewModel.card)).then(_setSourceAndNextStep, _handleInvalidSource);
    }
  }

  function _initStep3 () {
    viewModel.charge = new Charge({
      amount: viewModel.transaction.amount(),
      source: viewModel.source,
      destination: viewModel.destination,
      description: `Payment #${viewModel.transaction.formattedPaymentNumber()} for ${viewModel.transaction.projectName}`
    });
  }

  function _executeStep3 () {

    const _handleChargeSuccess = () => {
      const _updateModelTransaction = transaction => {
        viewModel.transaction.paidDate = transaction.paidDate;
        _incrementStep();
        viewModel.waitingOnAPI = false;
      };

      // TODO: Do something backendy with the charge object we get back from stripe. idk

      viewModel.transaction.paidDate = parseInt(new Date() / MILLISECONDS_IN_MICROSECONDS, 10);
      transactionsManager.update(viewModel.transaction).then(_updateModelTransaction);
    };

    const _handleChargeFailure = () => {
      _loadChargeUnsuccessfulModal().result.then(() => viewModel.waitingOnAPI = false);
    };

    paymentManager.createCharge(viewModel.charge)
      .then(_handleChargeSuccess, _handleChargeFailure);
  }

  function _exit () {
    $modalInstance.dismiss();
  }

  function _incrementStep () {
    viewModel.step += 1;

    if (viewModel.step > 4) {
      _exit();
    }

    viewModel.buttonText = BUTTON_TEXT[viewModel.step - 1];
  }

  function _nextButtonClick () {
    if (_shouldDisableNextButton()) {
      return;
    }

    viewModel.waitingOnAPI = true;
    if (viewModel.step === 2) {
      _executeStep2();
    } else if (viewModel.step === 3) {
      _executeStep3();
    } else {
      _exit();
    }
  }

  function _editCardInfo () {
    viewModel.step = 2;
    viewModel.buttonText = BUTTON_TEXT[viewModel.step - 1];
  }

  function _shouldDisableNextButton () {
    if (viewModel.waitingOnAPI === true) {
      return true;
    } else if (viewModel.step === 2 && !_hasValidCardInfo()) {
      return true;
    } else {
      return false;
    }
  }

  function _hasInvalidCardNumber () {
    const {number} = viewModel.card;

    if (isNaN(parseFloat(number)) || !(number && number.length === 16)) {
      return true;
    } else {
      return false;
    }
  }

  function _hasInvalidCardExpMonth () {
    const {expMonth} = viewModel.card;

    if (isNaN(parseFloat(expMonth)) || !(expMonth && expMonth.length === 2)) {
      return true;
    } else {
      return false;
    }
  }

  function _hasInvalidCardExpYear () {
    const {expYear} = viewModel.card;

    if (isNaN(parseFloat(expYear)) || !(expYear && expYear.length === 4)) {
      return true;
    } else {
      return false;
    }
  }

  function _hasInvalidCardCvc () {
    const {cvc} = viewModel.card;

    if (isNaN(parseFloat(cvc)) || !(cvc && cvc.length === 3)) {
      return true;
    } else {
      return false;
    }
  }

  function _hasValidCardInfo () {
    return !_hasInvalidCardNumber()
      && !_hasInvalidCardExpMonth()
      && !_hasInvalidCardExpYear()
      && !_hasInvalidCardCvc();
  }


  /****** Helpers ******/

  function _getStripeAccessToken (user) {
    const deferred = $q.defer();

    const _handleIntegrationSuccess = (result) => {
      // Setup user's stripe data
      _.assign(
        user.stripeInfo,
        {
          accessToken: result.access_token,
          publishableKey: result.stripe_publishable_key,
          stripeUserId: result.stripe_user_id
        }
      );

      // Send stripe data to server
      stripeInfoManager.createInfo(user.id, user.stripeInfo, loginManager.getToken());

      // Return Accesss Token
      deferred.resolve(result.accessToken);

      viewModel.waitingOnAPI = false;
    };

    const _handleIntegrationFailure = () => {
       _loadIntegrationFailureModal().result.then(() => deferred.reject('Unable to authenticate user via stripe'));
      viewModel.waitingOnAPI = false;
    };

    const _loadOAuth = () => {
     viewModel.waitingOnAPI = true;

     // Send then to stripe's website
      OAuth.popup('stripe')
        .done(_handleIntegrationSuccess)
        .fail(_handleIntegrationFailure);
    };

    if (user.stripeInfo.accessToken) { // return the existing access token we stored
      deferred.resolve(user.stripeInfo.accessToken);
    } else { // user has not yet integrated with stripe
      _loadIntegrationNoticeModal().result.then(_loadOAuth);
    }

    return deferred.promise;
  }

  function _loadIntegrationNoticeModal () {
    return $modal.open({
      controller: 'NotificationCtrl',
      controllerAs: 'notificationCtrl',
      templateUrl: 'app/common/modals/notification.html',
      size: 'sm',
      resolve: {
        type: () => 'info',
        message: () => 'Login with Stripe',
        details: () => 'You have not yet logged into stripe. You are now being redirected to stripe. Once you login, you will be returned to this site.'
      }
    });
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
  function _loadInvalidCardInfoModal () {
    return $modal.open({
      controller: 'NotificationCtrl',
      controllerAs: 'notificationCtrl',
      templateUrl: 'app/common/modals/notification.html',
      size: 'sm',
      resolve: {
        type: () => 'error',
        message: () => 'Card Not Valid',
        details: () => 'The credit card information that was entered is not valid. Please double check numbers, and correct it.'
      }
    });
  }
  function _loadChargeUnsuccessfulModal () {
    return $modal.open({
      controller: 'NotificationCtrl',
      controllerAs: 'notificationCtrl',
      templateUrl: 'app/common/modals/notification.html',
      size: 'sm',
      resolve: {
        type: () => 'error',
        message: () => 'Charge Unsuccessful',
        details: () => 'We were unable to transfer money from your card to the company. Feel free to try again. Sorry for the inconvience.'
      }
    });
  }
  function _loadNoDestinationStripeAccountModal () {
    return $modal.open({
      controller: 'NotificationCtrl',
      controllerAs: 'notificationCtrl',
      templateUrl: 'app/common/modals/notification.html',
      size: 'sm',
      resolve: {
        type: () => 'warning',
        message: () => 'No Payment Info',
        details: () => 'The user you are trying to pay has not yet imported their stripe account information into the payment processing system. Once they have done this you will be able to pay them'
      }
    });
  }
}
