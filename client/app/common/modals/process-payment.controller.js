'use strict';

angular.module('paymentProcessor')
  .controller('ProcessPaymentCtrl', processPaymentCtrl);

const MILLISECONDS_IN_MICROSECONDS = 1000;

function processPaymentCtrl ($modalInstance, transactionObj, userObj, stripeInfoManager, transactionManager, paymentManager) {
  const viewModel = this;

  /** Modal Variables **/
  viewModel.transaction = transactionObj;
  viewModel.user = userObj;
  viewModel.step = 1;
  
  // Absolutly imperitive that we wipe these out on open
  viewModel.accessToken = null;         // Step 1
  viewModel.source = null;              // Step 2 
  viewModel.existingSources = null;
  viewModel.newSource = null;
  viewModel.destination = null;         // Step 3
  viewModel.charge = null;              // Step 4

  /** Modal Functions **/
  viewModel.exit = _exit;

  // TODO: Move all server stuff that we can do before hand into an initialize to reduce latency
  _executeStep1();

  /****** Implementation ******/

  function _executeStep1 () {
    const accessToken,
          destination,
          source,
          charge;

    _getStripeAccessToken(viewModel.user).then(accessToken => {
        viewModel.accessToken = accessToken;
        _incrementStep();
        _initStep2();
    });
  }

  function _initStep2 () {
    const _setExistingSources = (sources) => {
      viewModel.existingSources = sources; 
    }

    // Hit Stripe API for Payment Sources
    paymentManager.getExistingSources(user.stripeInfo);

    // TODO: Build Blank Model for new payment method
    const newSource = {};
  }

  function _executeStep2(source) {
    const _setSourceAndNextStep = (paymentSource) => {
      // TODO: Make handler to handle failure case, which might be a common occurance
      viewModel.source = paymentSource;
      _incrementStep();
      _executeStep3();
    };

    if (source.isNewSource()) {
      paymentManager.saveNewSource(source).then(_setSourceAndNextStep);
    } else {
      _setSourceAndNextStep();
    }
  }

  function _executeStep3() {

    const _handleDoesHaveDestination = destination => { 
      viewModel.destination = destination;
      _incrementStep();
      _initStep4();
    };

    const _handleDoesNotHaveDestination = () => {
      // TODO: Show small pop up, on click, close small pop up and this pop up
    }

    transactionManager.getDestination(viewModel.transaction).then(_handleDoesHaveDestination).fail(_handleDoesNotHaveDestination);
  }

  function _initStep4() {
    viewModel.charge = new Charge({
      amount: viewModel.transaction.amount(),
      source: viewModel.source,
      destination: viewModel.destination
      // TODO: attrs here
    });
  }

  function _executeStep4() {

    const handleChargeSuccess = data => {
      const _updateModelTransaction(transaction) => {
        viewModel.transaction = transaction;
        _incrementStep();
      };

      // TODO: Show small pop up, on click close small pop up and this pop up

      viewModel.transaction.paid_date = new Date() / MILLISECONDS_IN_MICROSECONDS; // TODO: Revist Algorithm
      transactionManager.update(transaction).then(_updateModelTransaction);
    };

    const handleChargeFailure = data {
      // TODO: Show small pop up, on click close small pop up and this pop up
    };

    paymentManager.createCharge(viewModel.charge).then(_handleChargeSuccess).fail(handleChargeFailure);
  }

  function _exit () {
    $modalInstance.dismiss();
  }

  function _incrementStep () {
    viewModel.step += 1;

    if (viewModel.step > 4) {
      // TODO: Close Modal & return transaction
    }
  }

  /****** Helpers ******/

  const _getStripeAccessToken = user => {
    const deferred = $q.defer();

    const _handleIntegrationSuccess = (result) => {
      // Setup user's stripe data
      _.assign(
        user.stripeInfo, 
        {
          accessToken: result.accessToken,
          publishableKey: result.publishableKey,
          userID: result.userID
        }
      );

      // Send stripe data to server
      stripeInfoManager.create(user.id, user.stripeInfo);
      
      // Return Accesss Token
      deferred.resolve(result.accessToken);
    };

    const _handleIntegrationFailure = (err) => {
      console.log(err);
      // TODO: Open small pop up saying authentication failed. then close small pop up and current
      //        pop up
      deferred.reject('Unable to authenticate user via stripe');
    };
    
    if (user.stripeInfo.accessToken) { // return the existing access token we stored
      return user.stripeInfo.accessToken;  
    } else { // user has not yet integrated with stripe
      // TODO: Open small pop up saying that they will be direct to stripe for authentication. When
      //        they close the pop up, the stripe pop up will appear
      
      // Send then to stripe's website
      OAuth.popup('stripe').done(_handleIntegrationSuccess).fail(_handleIntegrationFailure);
    }

    return deferred.promise;
  };
    
}
  // AM I STILL DOING THIS

  // 1.) If user doesn't have a client id set
  //  First kill first modal, pop up new one. Then if they don't have client id, then do pop up.
  //  Get data from oath, put in a new Account model. Before you so anything else, save Account model
  //  to server for this user. That way we will have it already in the future
  //  1.a) use Oauth to get it
  //  1.b) send post to server, saving stripe data 
  // 2.) Get pre-requisite info from the user
  //  This experience might take some time to build. We want to hit stripe's API, get all payment 
  //  methods, and allow them to select an existing one, or enter a new one. After this, we will 
  //  get the reciever's acount info and put that in a model too.
  //  2.a) Make user select source for charge (show existing payment methods, let them enter custom) 
  //  2.b) Lookup receiver's stripe account id
  // 3.) Hit stripe's API to complete payment
  //  Make a model for the charge. build it with the objects we have just set up before. send
  //  post to the charge api of stripe, and check for success. Set payment date of the transaction,
  //  send post to server with the new transaction info. kill modal.
  //  3.a) Find 'source' info
  //  3.b) Find 'destination' account id
  //  3.c) Find 'amount' of charge'
  //  3.d) Send post to 'Charge' endpoint of stripe, with the above data filled

