'use strict';

angular.module('paymentProcessor')
  .controller('ProcessPaymentCtrl', processPaymentCtrl);

const MILLISECONDS_IN_MICROSECONDS = 1000;
const BUTTON_TEXT = ['Review Order', 'Review Order', 'Review Payment', 'Confirm Payment', 'Exit'];

function processPaymentCtrl ($q, $modalInstance, transactionObj, userObj, stripeInfoManager, loginManager, transactionsManager, paymentManager, Card, Source, Destination, Charge) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.transaction = transactionObj;
  viewModel.user = userObj;
  viewModel.step = 1;
  viewModel.buttonText = 'Review Charge';

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

  // TODO: Move all server stuff that we can do before hand into an initialize to reduce latency
  _executeStep1();

  /****** Implementation ******/

  function _executeStep1 () {
    _getStripeAccessToken(viewModel.user).then(accessToken => {
        viewModel.accessToken = accessToken;
        _incrementStep();
        _initStep2();
    });
  }

  function _initStep2 () {
    // TODO: Someday, Hit Stripe API for Payment Sources
    // paymentManager.getExistingSources(user.stripeInfo);

    viewModel.card = {};
  }

  function _executeStep2 () {
    const _setSourceAndNextStep = (tokenObj) => {
      // TODO: Make handler to handle failure case, which might be a common occurance
      viewModel.source = new Source(tokenObj);
      _incrementStep();
      _executeStep3();
    };

    paymentManager.createToken(new Card(viewModel.card)).then(_setSourceAndNextStep);
  }

  function _executeStep3 () {

    const _handleDoesHaveDestination = destination => {
      viewModel.destination = destination;
      _incrementStep();
      _initStep4();
    };

    const _handleDoesNotHaveDestination = () => {
      // TODO: Show small pop up, on click, close small pop up and this pop up
    };

    transactionsManager.getDestination(viewModel.transaction)
      .then(_handleDoesHaveDestination, _handleDoesNotHaveDestination);
  }

  function _initStep4 () {
    viewModel.charge = new Charge({
      amount: viewModel.transaction.amount(),
      source: viewModel.source,
      destination: viewModel.destination,
      description: `Payment #${viewModel.transaction.formattedPaymentNumber()} for ${viewModel.transaction.projectName}`
    });
  }

  function _executeStep4 () {

    const _handleChargeSuccess = () => {
      const _updateModelTransaction = transaction => {
        viewModel.transaction = transaction;
        _incrementStep();
      };

      // TODO: Show small pop up, on click close small pop up and this pop up
      // TODO: Do something backendy witht the charge object we get back from stripe. idk

      viewModel.transaction.paidDate = parseInt(new Date() / MILLISECONDS_IN_MICROSECONDS, 10);
      transactionsManager.update(viewModel.transaction).then(_updateModelTransaction);
    };

    const _handleChargeFailure = () => {
      // TODO: Show small pop up, on click close small pop up and this pop up
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
      // TODO: Close Modal & return transaction
    }

    viewModel.buttonText = BUTTON_TEXT[viewModel.step - 1];
  }

  function _nextButtonClick () {
    // TODO: Disable button after click
    if (viewModel.step === 4) {
      _executeStep4();
    } else {
      _executeStep2();
    }
  }

  function _editCardInfo () {
    viewModel.step = 2;
    viewModel.buttonText = BUTTON_TEXT[viewModel.step - 1];
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

      // TODO: Kill Spinner
    };

    const _handleIntegrationFailure = () => {
      // TODO: Open small pop up saying authentication failed. then close small pop up and current
      //        pop up
      deferred.reject('Unable to authenticate user via stripe');

      // TODO: Kill Spinner
    };

    if (user.stripeInfo.accessToken) { // return the existing access token we stored
      deferred.resolve(user.stripeInfo.accessToken);
    } else { // user has not yet integrated with stripe
      // TODO: Open small pop up saying that they will be direct to stripe for authentication. When
      //        they close the pop up, the stripe pop up will appear

      // TODO: Load Spinner

      // Send then to stripe's website
      OAuth.popup('stripe')
        .done(_handleIntegrationSuccess)
        .fail(_handleIntegrationFailure);
    }

    return deferred.promise;
  }
}
