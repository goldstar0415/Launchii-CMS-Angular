var env = require('../env');
var moment = require('moment');
var helpers = require('../helpers');
var path = require('path');
describe('SuperBlocks Controller', function() {

	var blocksCount = 0;
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


	it('should delete create and update a block', function() {
		browser.setLocation('dashboard');

		element(by.xpath('//ul[contains(@class, "page-sidebar-menu")]/li[9]/a')).click();
		browser.sleep(2000);
		element(by.xpath('//a[@ui-sref="dashboard.superblock"]')).click();
		browser.sleep(5000);
		expect(browser.getCurrentUrl()).toContain('dashboard/super-block');

		return element.all(by.xpath('//a[@ng-click="vm.archiveSuperBlock($event.currentTarget, superblock)"]')).then(function(achivebuttons){
			blocksCount = achivebuttons.length;

			// create a super block

			// element(by.xpath('//a[@ui-sref="dashboard.superblock.add"]')).click();
			// browser.sleep(5000);

			// element(by.xpath('//div[@class="form-actions"]//button')).click();
			// expect(browser.getCurrentUrl()).toContain('/dashboard/super-block/add');
			// expect(element(by.model('vm.form.name')).getAttribute('class')).toContain('ng-invalid');

			// element(by.model('vm.form.name')).sendKeys('TEST SUPER BLOCK');

			// var fileToUpload = '../test.png',
			// 	absolutePath = path.resolve(__dirname, fileToUpload);

			// element(by.model('vm.form.image_file')).sendKeys(absolutePath);
			// element(by.model('vm.form.content')).sendKeys('TEST SUPER BLOCK CONTENT');

			// element(by.xpath('//div[@class="form-actions"]//button')).click();
			// browser.sleep(5000);

			// expect(browser.getCurrentUrl()).toContain('dashboard/super-block');

			//update the super block 

			element.all(by.xpath('//a[@ui-sref="dashboard.superblock.edit({id:superblock.uid})"]')).then(function(editbuttons){
				var originCount = editbuttons.length;
				expect(originCount).toBeGreaterThanOrEqual(blocksCount);
				editbuttons[0].click();
				browser.sleep(5000);

				expect(browser.getCurrentUrl()).toContain('/dashboard/super-block/edit');
				var temp_name = element(by.model('vm.form.name')).getText();

				helpers.clearInput(element(by.model('vm.form.name')));
				element(by.model('vm.form.name')).sendKeys('1111 TEST SUPER BLOCK');
				element(by.xpath('//div[@class="form-actions"]//button')).click();
				browser.sleep(5000);

				expect(browser.getCurrentUrl()).toContain('/dashboard/super-block');
				// expect(element(by.binding('superblock.name')).getText()).toEqual('1111 TEST SUPER BLOCK');

				// element.all(by.xpath('//a[@ui-sref="dashboard.superblock.edit({id:superblock.uid})"]')).then(function(editbuttonssecond){
				// 	editbuttonssecond[0].click();
				// 	browser.sleep(5000);

				// 	helpers.clearInput(element(by.model('vm.form.name')));
				// 	element(by.model('vm.form.name')).sendKeys(temp_name);
				// 	element(by.xpath('//div[@class="form-actions"]//button')).click();
				// 	browser.sleep(5000);
				// });
					

			});


		});


	});

});