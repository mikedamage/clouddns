var q      = require('q');
var utils  = require('../../es5/lib/utilities');
var client = require('q-io/http');

require('jasmine-expect');

describe('utilities', function() {

  describe('getResponseJSON', function() {
    var params;

    beforeEach(function() {

      spyOn(client, 'request').and.callFake(function() {
        return q({
          body: {
            read: function() {
              return q({
                toString: function() {
                  return q(JSON.stringify(response));
                }
              });
            }
          }
        });
      });

    });

    it ('should call client.request', function() {
      params = {
        url: 'http://google.com',
        method: 'GET'
      };

      var response = utils.getResponseJSON(params, client);

      expect(client.request).toHaveBeenCalledWith(params);
    });

  });

  describe('getRootDomain', function() {

    it ('should return the root domain of a subdomain', function() {
      expect(utils.getRootDomain('www.foo.com')).toEqual('foo.com');
    });

    it ('should return null if given a string with the wrong format', function() {
      expect(utils.getRootDomain('foo')).toBeNull();
    });

  });

});

// vim: set syntax=jasmine :
