/* jshint node: true, esnext: true */

'use strict';

import _               from 'lodash';
import q               from 'q';
import fs              from 'q-io/fs';
import http            from 'q-io/http';
import moment          from 'moment';
import CloudFlare      from './lib/cloudflare';
import getResponseJSON from './lib/get-response-json';

const jsonipURL = 'http://jsonip.com/';

class CloudDNS {
  constructor(options = {}) {

    this.lastIP  = '';
    this.options = _.assign({ domains: [], ttl: 3e2 }, options);

    if (!this.options.token) {
      throw new Error('options.token is required');
    }

    if (!this.options.email) {
      throw new Error('options.email is required');
    }

    this.client = this.options.client || new CloudFlare({
      email: this.options.email,
      token: this.options.token
    });
  }

  getCurrentIP() {
    return getResponseJSON(jsonipURL);
  }

  getLastIP() {
    return q(this.lastIP);
  }

  needsUpdate() {
    return q.all([
      this.getLastIP(),
      this.getCurrentIP()
    ]).spread((last, current) => last !== current);
  }

  update(force = false) {
    return this.needsUpdate().then(needsUpdate => {
      let deferred = q.defer();

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
