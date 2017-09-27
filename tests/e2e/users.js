
var env = require('../env');
var moment = require('moment');
var helpers = require('../helpers');
xdescribe('Users Controller', function() {

	var usersCount = 0;
	var originalTimeout;

	beforeEach(function() {
			originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
	});

	afterEach(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	function selectDropdownByNumber(element, index, milliseconds) {
		element.all(by.tagName('option'))
			.then(function(options) {
				options[index].click();
			});
			if (typeof milliseconds !== 'undefined') {
				browser.sleep(milliseconds);
		 }
	}

	beforeAll(function() {
	});


	it('should create user and delete it', function() {
		browser.setLocation('dashboard');
		/******************* CREATE USER **********************/
		element(by.xpath('//ul[contains(@class, "page-sidebar-menu")]/li[10]/a')).click();
		browser.sleep(2000);
		element(by.xpath('//a[@ui-sref="dashboard.user.add"]')).click();
		browser.sleep(2000);

		element(by.model('vm.form.name')).sendKeys('AdminUserTest');

		///////////////////// Verfiy the validations are working
		element(by.xpath('//div[contains(@class, "form-actions")]//button')).click(); //Click add button
		browser.sleep(100);
		expect(element(by.model('vm.form.email')).getAttribute('class')).toContain('ng-invalid');
		expect(browser.getCurrentUrl()).toContain('dashboard/user/add');

		element(by.model('vm.form.email')).sendKeys('kevintaylor19901010@gmail.com');

		selectDropdownByNumber(element(by.model('vm.form.role')), 1, 1000);
		selectDropdownByNumber(element(by.model('vm.form.status')), 1, 1000);

		browser.sleep(2000);
		element(by.xpath('//div[contains(@class, "form-actions")]//button')).click();
		browser.sleep(4000);

		///////////////////// Getting just added user
		expect(browser.getCurrentUrl()).toContain('/dashboard/user');

		element(by.model('vm.searchTerm')).sendKeys('AdminUserTest');
		element(by.xpath('//span[@ng-click="vm.startSearch()"]')).click();
		browser.sleep(4000);

		expect(element.all(by.xpath('//a[@ui-sref="dashboard.user.edit({id:user.uid})"]')).then(function(buttons){ return buttons.length;}))
			.toBeGreaterThanOrEqual(1);

		/******************* UPDATE USER **********************/
		expect(element.all(by.xpath('//a[@ui-sref="dashboard.user.edit({id:user.uid})"]')).then(
			function(buttons){
				button = buttons[0];
				button.click();
				browser.sleep(4000);
				expect(browser.getCurrentUrl()).toContain('/dashboard/user/edit');

				element(by.model('vm.form.name')).sendKeys('Good');
				element(by.xpath('//div[contains(@class, "form-actions")]//button')).click();
				browser.sleep(4000);

				expect(browser.getCurrentUrl()).toContain('/dashboard/user');

				element(by.model('vm.searchTerm')).sendKeys('Good');
				element(by.xpath('//span[@ng-click="vm.startSearch()"]')).click();
				browser.sleep(4000);

				expect(element.all(by.xpath('//a[@ng-click="vm.deleteUser($event.currentTarget, user)"]')).then(function(buttons){ return buttons.length;}))
					.toBeGreaterThanOrEqual(1);

				/******************* DELETE USER **********************/
				expect(element.all(by.xpath('//a[@ng-click="vm.deleteUser($event.currentTarget, user)"]')).then(function(buttons){
					button = buttons[0];
					button.click();

					browser.sleep(500);
					element(by.xpath('//div[contains(@class, "bootbox-confirm")]//div[@class="modal-footer"]/button[2]')).click();

					browser.sleep(5000);

					expect(element.all(by.xpath('//a[@ng-click="vm.deleteUser($event.currentTarget, user)"]')).then(function(buttons){ return buttons.length;}))
						.toBeGreaterThanOrEqual(0);
				}));

			}));


	});


	it('test on jasmine', function(){
		expect('/dashboard/user').toContain('/dashboard/user');
	})


});
