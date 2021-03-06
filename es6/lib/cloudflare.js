/* jshint node: true */

'use strict';

import _                 from 'lodash';
import http              from 'q-io/http';
import url               from 'url';
import path              from 'path';
import {getResponseJSON} from './utilities';

const endpoint = 'https://api.cloudflare.com/client/v4';
const base     = url.parse(endpoint);
const defaults = {
  token: null,
  email: null
};

let queryString = params => {
  if (!params || !_.isObject(params)) return '';
  return _.map(params, (val, key) => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(val);
  }).join('&');
};

let endpointURL = function() {
  let urlPath, params;
  let query = '';

  if (arguments.length && _.isObject(arguments[arguments.length - 1])) {
    params = Array.prototype.pop.call(arguments);

    if (!_.isEmpty(params)) {
      query += '?' + queryString(params);
    }
  }

  urlPath = '/' + _.map(arguments, encodeURIComponent).join('/');

  return endpoint + urlPath + query;
};

class CloudFlare {
  constructor(options = {}) {
    this.options = _.assign(defaults, options);
    this.headers = {
      'x-auth-email': this.options.email,
      'x-auth-key': this.options.token,
      'host': base.hostname,
      'content-type': 'application/json'
    };

    if (!this.options.email || !this.options.token) {
      throw new Error('email and token are required');
    }
  }

  listZones(params = {}) {
    let request = {
      url: endpointURL('zones', params),
      headers: this.headers,
      method: 'GET'
    };

    return getResponseJSON(request);
  }

  getZoneDetails(zoneID) {
    let request = {
      url: endpointURL('zones', zoneID),
      headers: this.headers,
      method: 'GET'
    };

    return getResponseJSON(request);
  }

  getZoneRecords(zoneID, params = {}) {
    let request = {
      url: endpointURL('zones', zoneID, 'dns_records', params),
      headers: this.headers,
      method: 'GET'
    };

    return getResponseJSON(request);
  }

  getRecordDetails(zoneID, recordID) {
    let request = {
      url: endpointURL('zones', zoneID, 'dns_records', recordID),
      headers: this.headers,
      method: 'GET'
    };

    return getResponseJSON(request);
  }

  updateRecord(zoneID, recordID, params = {}) {
    if (!_.isObject(params) || _.isEmpty(params)) {
      throw new Error('params are required');
    }

    let request = {
      url: endpointURL('zone', zoneID, 'dns_records', recordID),
      headers: this.headers,
      method: 'PUT',
      body: JSON.stringify(params)
    };

    return getResponseJSON(request);
  }

  purgeZoneCache(zoneID) {
    let request = {
      url: endpointURL('zones', zoneID, 'purge_cache'),
      headers: this.headers,
      method: 'DELETE',
      body: JSON.stringify({ purge_everything: true })
    };

    return getResponseJSON(request);
  }
}

export default CloudFlare;
