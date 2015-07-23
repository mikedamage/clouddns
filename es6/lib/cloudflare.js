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

var endpointURL = function() {
  var path;
  var query = '';

  if (arguments.length && _.isObject(arguments[arguments.length - 1])) {
    query = '?' + queryString(Array.prototype.pop.call(arguments));
  }

  path = '/' + _.map(arguments, encodeURIComponent).join('/');

  return endpoint + path + query;
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

  var request = {
    url: endpointURL('zones', params),
    headers: this.headers,
    method: 'GET'
  };

  return http.request(request)
    .get('body')
    .invoke('read')
    .invoke('toString')
    .then(JSON.parse);
};

CloudFlare.prototype.getZoneRecords = function(zoneID, params) {
  if (!params) {
    params = {};
  }

  var request = {
    url: endpointURL('zones', zoneID, 'dns_records', params),
    headers: this.headers,
    method: 'GET'
  };

  return http.request(request)
    .get('body')
    .invoke('read')
    .invoke('toString')
    .then(JSON.parse);
};

CloudFlare.prototype.updateRecord = function(zoneID, recordID, params) {
  if (!params || !_.isObject(params)) {
    throw new Error('params must be an object');
  }

  var request = {
    url: endpointURL('zones', zoneID, 'dns_records', recordID),
    headers: this.headers,
    method: 'PUT',
    body: JSON.stringify(params)
  };

  return http.request(request)
    .get('body')
    .invoke('read')
    .invoke('toString')
    .then(JSON.parse);
};

module.exports = CloudFlare;
