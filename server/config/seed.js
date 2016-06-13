/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

import SensorNotification from '../api/sensorNotification/sensorNotification.model';
import SensorStatus from '../api/sensorStatus/sensorStatus.model';
import User from '../api/user/user.model';
var bcrypt = require('bcrypt');

User.find({}).removeAsync().then(() => {
  bcrypt.hash('soccer', 10, function(err, hash) {
    User.create({
      username: 'gabeP',
      fullname: 'Gabe Harms',
      password: hash
    }, {
      username: 'mollyK',
      fullname: 'Molly Harms',
      password: hash
    });
  });
});
