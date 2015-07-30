var CloudDNS = require('../es5/index');

require('jasmine-expect');

describe('CloudDNS', function() {

  var client, instance;

  beforeEach(function() {
    client = jasmine.createSpyObj('client', [
      'listZones',
      'getZoneDetails',
      'getZoneRecords',
      'getRecordDetails',
      'updateRecord',
      'purgeZoneCache'
    ]);
  });

  describe('exceptions', function() {

    it ('should throw an error when no domains are passed', function() {
      var badInstance = function() {
        return new CloudDNS({
          email: 'foo@bar.com',
          token: 'foo',
          domains: []
        });
      };

      expect(badInstance).toThrowError('options.domains must not be empty');
    });

    it ('should throw an error when no email is passed', function() {
      var badInstance = function() {
        return new CloudDNS({
          token: 'foo',
          domains: [ 'foo.bar.com' ]
        });
      };

      expect(badInstance).toThrowError('options.email is required');
    });

    it ('should throw an error when no token is passed', function() {
      var badInstance = function() {
        return new CloudDNS({
          email: 'foo@bar.com',
          domains: [ 'foo.bar.com' ]
        });
      };

      expect(badInstance).toThrowError('options.token is required');
    });

  });

  describe('initialization', function() {

    var instance;

    beforeEach(function() {
      instance = new CloudDNS({
        email: 'foo@bar.com',
        token: 'abc123',
        domains: [ 'foo.bar.com', 'bar.bar.com', 'baz.quux.com' ]
      });
    });

    it ('should be an instance of CloudDNS', function() {
      expect(instance).toEqual(jasmine.any(CloudDNS));
    });

    it ('should create a de-duplicated array of root domain names', function() {
      expect(instance).toHaveArrayOfStrings('rootDomains');
      expect(instance).toHaveArrayOfSize('rootDomains', 2);
      expect(instance.rootDomains).toEqual([ 'bar.com', 'quux.com' ]);
    });

  });

});
// vim: set syntax=jasmine :
