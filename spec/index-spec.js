var CloudDNS = require('../es5/index');

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

  it('should throw an error when no email is passed', function() {
    var badInstance = function() {
      return new CloudDNS({
        token: 'foo'
      });
    };

    expect(badInstance).toThrowError('options.email is required');
  });

  it('should throw an error when no token is passed', function() {
    var badInstance = function() {
      return new CloudDNS({
        email: 'foo@bar.com'
      });
    };

    expect(badInstance).toThrowError('options.token is required');
  });

});
