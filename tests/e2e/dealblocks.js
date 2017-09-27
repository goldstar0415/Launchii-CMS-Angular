var env = require('../env');
var moment = require('moment');
var helpers = require('../helpers');
describe('Deal Blocks Controller', function() {

	var dealsCount = 0;
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


	it('should delete all deals and create and update', function() {
		browser.setLocation('dashboard');

		element(by.xpath('//ul[contains(@class, "page-sidebar-menu")]/li[6]/a')).click();
		browser.sleep(2000);
		element(by.xpath('//a[@ui-sref="dashboard.deal"]')).click();
		browser.sleep(5000);

		return element.all(by.xpath('//a[@ui-sref="dashboard.deal.design({id:deal.uid})"]')).then(function(designbuttons){
			designbuttons[0].click();
			browser.sleep(5000);
			expect(browser.getCurrentUrl()).toContain('dashboard/deal/design');
			// adding the deal block

			// var countsDesign = 0;
			// element.all(by.xpath('//a[@ng-click="vm.deleteDealBlock(dealBlock, $index)"]')).then(function(deletebuttons){
			// 	countsDesign = deletebuttons.length;
			// });
			// browser.sleep(2000);

			// element(by.xpath('//a[@ng-click="vm.openAddDesignBlockModal()"]')).click();
			// browser.sleep(1000);
			// element.all(by.xpath('//div[@ng-dblclick="vm.insertDealBlock(block)"]')).then(function(addbuttons){
			// 	browser.actions().doubleClick(addbuttons[0]).perform();
			// 	browser.sleep(200);
			// });

			// browser.sleep(5000);
			// element.all(by.xpath('//a[@ng-click="vm.deleteDealBlock(dealBlock, $index)"]')).then(function(deletebuttons){
			// 	originCount = deletebuttons.length;
			// 	expect(originCount).toBeGreaterThanOrEqual(countsDesign);

			// 	deletebuttons[deletebuttons.length-1].click();
			// 	originCount = deletebuttons.length;
			// 	expect(originCount).toBeGreaterThanOrEqual(countsDesign);
			// });

			// browser.sleep(2000);

			//***** Deal Command ************//
			element.all(by.xpath('//a[contains(@class, "link-non-underline")]')).then(function(commandbuttons){

				// Preview Button
				browser.driver.executeScript('window.scrollTo(0, 0);').then(function() {
					browser.sleep(1000);
				});				
				commandbuttons[0].click();
				browser.sleep(2000);

				browser.getAllWindowHandles().then(function (handles) {
					var previewHandle = handles[1];
					var designHandle = handles[0];

					browser.driver.switchTo().window(previewHandle).then(function () { //the focus moves on new tab
						expect(browser.driver.getCurrentUrl()).toContain("/deals/");
						expect(browser.driver.getCurrentUrl()).toContain("/preview");
						browser.driver.close();
					});

					browser.driver.switchTo().window(designHandle);					
				});

				if(commandbuttons.length > 1){
					// Live Button
					commandbuttons[1].click();
					browser.sleep(3000);

					browser.getAllWindowHandles().then(function (handles) {
						var previewHandle = handles[1];
						var designHandle = handles[0];

						browser.driver.switchTo().window(previewHandle).then(function () { //the focus moves on new tab
							expect(browser.driver.getCurrentUrl()).toContain("/deals/");
							browser.driver.close();
						});
						browser.driver.switchTo().window(designHandle);					
					});

					// Publish to Live Button
					var beforePublish = browser.driver.getCurrentUrl();
					commandbuttons[2].click();
					browser.sleep(3000);
					var afterPublish = browser.driver.getCurrentUrl();					
					expect(beforePublish).toEqual(afterPublish);
				}
			});

		});
	});

});
