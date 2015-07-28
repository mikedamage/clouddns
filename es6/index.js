/* jshint node: true, esnext: true */

'use strict';

import _               from 'lodash';
import Q               from 'q';
import fs              from 'q-io/fs';
import http            from 'q-io/http';
import moment          from 'moment';
import CloudFlare      from './lib/cloudflare';
import getResponseJSON from './lib/get-response-json';

const jsonipURL = 'http://jsonip.com/';
const defaults  = {
  token: null,
  email: null,
  domains: [],
  ttl: 3e2
};

class CloudDNS {
  constructor(options = {}) {

    this.lastIP  = '';
    this.options = _.assign(defaults, options);

    if (!this.options.token) {
      throw new Error('options.token required');
    }

    if (!this.options.email) {
      throw new Error('options.email is required');
    }

    this.client = new CloudFlare({
      email: this.options.email,
      token: this.options.token
    });
  }

  getCurrentIP() {
    return getResponseJSON(jsonipURL);
  }

  getLastIP() {
    return Q(this.lastIP);
  }

  needsUpdate() {
    return Q.all([
      this.getLastIP(),
      this.getCurrentIP()
    ]).spread((last, current) => last !== current);
  }

  update(force = false) {
    return this.needsUpdate().then(needsUpdate => {
      let deferred = Q.defer();

      if (!needsUpdate && !force) {
        deferred.resolve(false);
      } else {
        // todo - actually do things to update the IP
      }

      return deferred.promise;
    });
  }
}

export default CloudDNS;
