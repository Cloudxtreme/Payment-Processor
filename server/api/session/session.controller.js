/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /api/session              ->  create
 */

'use strict';

import _ from 'lodash';
import config from '../../config/environment';
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var User = require('../user/user.model');
var UserLog = require('../userLog/userLog.model');


var secretKey = config.secrets.session;


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function createUserLogEntry(username, success, ip) {
  UserLog.createAsync(
    {
      username: username,
      successful: success,
      ip: ip
    }
  ).catch();
}

// Authenticates a user and creates a session
export function create(req, res) {
  User.findOne({username: req.body.username})
    .select('password')
    .exec(function(err, user) {
      if (err) { return res.sendStatus(500); }
      if (!user) {
        createUserLogEntry(req.body.username, false, req.ip);
        return res.sendStatus(401);
      }
      bcrypt.compare(req.body.password, user.password, function(err, valid) {
        createUserLogEntry(req.body.username, !err && valid, req.ip);
        if (err) { return res.sendStatus(500); }
        if (!valid) { return res.sendStatus(401); }
        var token = jwt.encode({username: req.body.username}, secretKey);
        res.json(token);
      });
  });
}
