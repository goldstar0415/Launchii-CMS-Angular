
var env = require('../env');
var helpers = require('../helpers');
var moment = require('moment');
var path = require('path');
xdescribe('Brands Controller', function() {


	var originalTimeout;

	beforeEach(function() {
			originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
	});

	afterEach(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
	});

	beforeAll(function() {
	});

	// it('should be on dashboard', function() {

	//   browser.getCurrentUrl().then(function(url){
	//   	expect(url).toEqual(env.baseUrl + '#!/dashboard');
	//   });

	// });


	it('should delete a brand and create new brand', function() {
		//Should Ensure All deals are deleted before deleting a brand

		element(by.xpath('//ul[contains(@class, "page-sidebar-menu")]/li[4]/a')).click();
		browser.sleep(1000);
		element(by.xpath('//a[@ui-sref="dashboard.deal"]')).click();

		browser.sleep(5000);

		return element.all(by.xpath('//a[@ng-click="vm.deleteDeal($event.currentTarget, deal)"]')).then(function(deleteButtons){
			var originalLen = deleteButtons.length;
			if (deleteButtons.length == 0) {
				expect(true).toEqual(true);
			}

			deleteButtons.forEach(function(btn){ 
				btn.click();
				browser.sleep(500);
				element(by.xpath('//div[contains(@class, "bootbox-confirm")]//div[@class="modal-footer"]/button[2]')).click();
				browser.sleep(500);
			});
			browser.sleep(5000);
			element.all(by.xpath('//a[@ng-click="vm.deleteDeal($event.currentTarget, deal)"]')).then(function(newDeleteButtons){				
				dealsCount = newDeleteButtons.length;
				expect(newDeleteButtons.length).toEqual(0);
			});

			///DELETE all brands
			element(by.xpath('//ul[contains(@class, "page-sidebar-menu")]/li[3]/a')).click();
			browser.sleep(1000);
			element(by.xpath('//a[@ui-sref="dashboard.brand"]')).click();

			return element.all(by.xpath('//a[@ng-click="vm.deleteBrand($event.currentTarget, brand)"]')).then(function(deleteButtons){
				var originalLen = deleteButtons.length;
				if (deleteButtons.length == 0) {
					expect(true).toEqual(true);
				}

				deleteButtons.forEach(function(btn){ 
					btn.click();
					browser.sleep(500);
					element(by.xpath('//div[contains(@class, "bootbox-confirm")]//div[@class="modal-footer"]/button[2]')).click();

				});
				browser.sleep(3000);
				element.all(by.xpath('//a[@ng-click="vm.deleteBrand($event.currentTarget, brand)"]')).then(function(newDeleteButtons){				
					expect(newDeleteButtons.length).toEqual(0);
				});



				//Add Brand
				browser.sleep(1000);
				element(by.xpath('//a[@ui-sref="dashboard.brand.add"]')).click();

				browser.sleep(5000);


				/***************Validation on empty name field *******************************/
				element(by.xpath('//div[@class="form-actions"]//button')).click();				//Click Add
				expect(browser.getCurrentUrl()).toContain('/dashboard/brand/add');
				expect(element(by.model('vm.form.name')).getAttribute('class')).toContain('ng-invalid');  //Required
				/*****************************************************************************/


				element(by.model('vm.form.name')).sendKeys('TEST BRAND');  
				element(by.model('vm.form.email')).sendKeys('test.e2e@brand.com');
				element(by.model('vm.form.description')).sendKeys('TEST Description');
				
				/***************Validation on empty logo field *******************************/
				element(by.xpath('//div[@class="form-actions"]//button')).click();				//Click Add
				expect(browser.getCurrentUrl()).toContain('/dashboard/brand/add');
				expect(element(by.model('vm.form.logo')).getAttribute('class')).toContain('ng-invalid');  //Required
				/*****************************************************************************/

				var fileToUpload = '../test.png',
						absolutePath = path.resolve(__dirname, fileToUpload);

				element(by.model('vm.form.logo')).sendKeys(absolutePath);
				element(by.model('vm.form.logo.description')).sendKeys('Logo DESC');

				element(by.model('vm.form.cover')).sendKeys(absolutePath);
				element(by.model('vm.form.cover.description')).sendKeys('Cover DESC');

				element(by.xpath('//div[@class="form-actions"]//button')).click();
				browser.sleep(5000);


				expect(browser.getCurrentUrl()).toContain('/dashboard/brand');
				expect(element.all(by.xpath('//a[@ng-click="vm.deleteBrand($event.currentTarget, brand)"]')).then(function(buttons){ return buttons.length;})) 
				.toBeGreaterThanOrEqual(1);


				/**************************TEST on Update Brand*******************************/
				browser.sleep(5000);
				element(by.xpath('//a[@ui-sref="dashboard.brand.edit({id:brand.uid})"]')).click();
				element(by.model('vm.form.name')).sendKeys(' Updated');
				browser.sleep(2000);
				element(by.xpath('//div[contains(@class, "form-actions")]//button')).click();
				expect(browser.getCurrentUrl()).toContain('/dashboard/brand');
				expect(element(by.binding('brand.name')).getText())
				.toEqual('TEST BRAND Updated');
				/*****************************************************************************/
			});


		});
	});
});	