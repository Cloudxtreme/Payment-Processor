'use strict';
angular.module('paymentProcessor')
  .factory('Fetch', fetch);

const DEFAULT_FETCH = {
  url: null,
  model: null
};

function fetch () {

  // Constructor
  function Fetch (fetchData) {
    Object.assign(
      this,
      DEFAULT_FETCH,
      {
        url: fetchData.url,
        model: fetchData.model
      }
    );
  }

  // Member Functions
  Fetch.prototype = { };

  return Fetch;
}
