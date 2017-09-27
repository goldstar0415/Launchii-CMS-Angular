
var env = require('../env');
var moment = require('moment');
var helpers = require('../helpers');
xdescribe('Category Controller', function() {

	var dealsCount = 0;
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


	it('should create and update and delete', function() {
		browser.setLocation('dashboard');
		/*******************Delete All DEALS**********************/
		element(by.xpath('//ul[contains(@class, "page-sidebar-menu")]/li[5]/a')).click();
		browser.sleep(2000);


		/*******************Create a New DEAL**********************/
		browser.driver.manage().window().maximize();
		element(by.xpath('//a[@ui-sref="dashboard.category.add"]')).click();
		browser.sleep(5000);
		
		//Start filling inputs
		////////Verfiy the validations are working
		element(by.xpath('//div[contains(@class, "form-actions")]//button')).click(); //Click add button
		browser.sleep(100);
		expect(element(by.model('vm.form.name')).getAttribute('class')).toContain('ng-invalid');
		expect(browser.getCurrentUrl()).toContain('dashboard/category/add');
		/*****************************************************************/

		element(by.model('vm.form.name')).sendKeys('TEST CAT');
	
		//Add Button
		browser.sleep(2000);
		element(by.xpath('//div[contains(@class, "form-actions")]//button')).click();
		browser.sleep(4000);

		expect(browser.getCurrentUrl()).toContain('/dashboard/category');
		element.all(by.xpath('//table//tbody/tr')).then((categories)=> {

			expect(categories.length).toBeGreaterThanOrEqual(1);

			for (let index = 0; index < categories.length; index++) {
				browser.isElementPresent(by.xpath('//table//tbody/tr['+(index+1)+']')).then(deleteCat)


				var deleteCat =function(present) {
					if(!present)
						return;
					var category = element(by.xpath('//table//tbody/tr['+(index+1)+']'));
					category.element(by.xpath('./td[1]')).getText()
					// .then((name) => {

					// 	if (name == 'TEST CAT') {
					// 		var editBtn = category.element(by.xpath('.//a[@ui-sref="dashboard.category.edit({id:category.uid})"]')).click();
					// 		if (editBtn)
					// 			editBtn.click();
					// 		else return null;
					// 		browser.sleep(1000);

					// 		element(by.model('vm.form.name')).sendKeys(' Updated');

					// 		element(by.xpath('//div[contains(@class, "form-actions")]//button')).click();
					// 		browser.sleep(4000);
					// 		expect(browser.getCurrentUrl()).toContain('/dashboard/category');
					// 		expect(true).toBe(true);

					// 		return element.all(by.xpath('//table//tbody/tr['+index+']'));
					// 	}
					// 	return null;

					// })
					.then(name => {
						if (name == 'TEST CAT') {
							var deleteBtn = category.element(by.xpath('.//a[@ng-click="vm.deleteCategory($event.currentTarget, category)"]'));
							if (deleteBtn)
								deleteBtn.click();
							else return;

							browser.sleep(500);
							element(by.xpath('//div[contains(@class, "bootbox-confirm")]//div[@class="modal-footer"]/button[2]')).click();
							browser.sleep(500);
							expect(browser.getCurrentUrl()).toContain('/dashboard/category');
						}
					});
				}


			}
			/*******************Update the NEW CAT**********************/
			// categories.each((category) => {
			// 	browser.isElementPresent(category).then(()=>{
			// 		// .then((name) => {

			// 		// 	if (name == 'TEST CAT') {
			// 		// 		var editBtn = category.element(by.xpath('.//a[@ui-sref="dashboard.category.edit({id:category.uid})"]')).click();
			// 		// 		if (editBtn)
			// 		// 			editBtn.click();
			// 		// 		else return null;
			// 		// 		browser.sleep(1000);

			// 		// 		element(by.model('vm.form.name')).sendKeys(' Updated');

			// 		// 		element(by.xpath('//div[contains(@class, "form-actions")]//button')).click();
			// 		// 		browser.sleep(4000);
			// 		// 		expect(browser.getCurrentUrl()).toContain('/dashboard/category');
			// 		// 		expect(true).toBe(true);

			// 		// 		return element.all(by.xpath('//table//tbody/tr['+index+']'));
			// 		// 	}
			// 		// 	return null;

			// 		// })
			// 	});
			// });
		});

	});

});	