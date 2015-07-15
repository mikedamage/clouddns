/* jshint node: true */

'use strict';

var _    = require('lodash');
var http = require('q-io/http');
var url  = require('url');
var path = require('path');

var endpoint = 'https://api.cloudflare.com/client/v4';
var base     = url.parse(endpoint);
var defaults = {
  token: null,
  email: null
};

var queryString = function(params) {
  if (!params || !_.isObject(params)) return '';

  return _.map(params, function(val, key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(val);
  }).join('&');
};

var CloudFlare = function CloudFlare(options) {
  this.options = _.assign(defaults, options);
  this.headers = {
    'x-auth-email': this.options.email,
    'x-auth-key': this.options.token,
    'host': base.hostname,
    'content-type': 'application/json'
  };

  if (!this.options.email || !this.options.token) {
    throw new Error('Email address and API token are required options');
  }
};

CloudFlare.prototype.listZones = function(params) {
  if (!params) {
    params = {};
  }

  var self  = this;
  var query = !_.isEmpty(params) ? queryString(params) : '';
  var request = {
    url: endpoint + '/zones' + query,
    headers: this.headers,
    method: 'GET'
  };

  return http.request(request)
    .get('body')
    .invoke('read')
    .invoke('toString')
    .then(JSON.parse);
};

module.exports = CloudFlare;
