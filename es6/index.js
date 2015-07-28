/* jshint node: true, esnext: true */

'use strict';

import _          from 'lodash';
import Q          from 'q';
import fs         from 'q-io/fs';
import http       from 'q-io/http';
import moment     from 'moment';

const jsonipURL = 'http://jsonip.com/';
const defaults  = {
  domains: [],
  ttl: 3e2
};

class CloudDNS {
  constructor(options = {}) {
    this.lastIP  = '';
    this.options = _.assign(defaults, options);
  }

  getCurrentIP() {
    return http.request(jsonipURL)
      .get('body')
      .invoke('read')
      .invoke('toString')
      .then(JSON.parse)
      .get('ip');
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
