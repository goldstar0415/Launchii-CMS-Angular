// conf.js
var env = require('./tests/env');

exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['tests/e2e/*.js'],
  baseUrl: env.baseUrl,
  capabilities: {
    'browserName': 'chrome',
  },
  onPrepare: function() {
    browser.driver.manage().window().maximize();
    browser.driver.get(env.baseUrl);
    browser.sleep(1000);
    browser.driver.findElement(by.name('email')).sendKeys(env.email);
    browser.driver.findElement(by.name('password')).sendKeys(env.password);
    browser.driver.findElement(by.xpath('//div[@class="form-actions"]/button[1]')).click();
    
    browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        return url == env.baseUrl + '#!/';
      });
    }, 10000);
  }
}