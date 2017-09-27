
var env = require('../env');
var moment = require('moment');
var helpers = require('../helpers');
xdescribe('Deals Controller', function() {

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
		/*******************Delete All DEALS**********************/
		element(by.xpath('//ul[contains(@class, "page-sidebar-menu")]/li[4]/a')).click();
		browser.sleep(2000);
		element(by.xpath('//a[@ui-sref="dashboard.deal"]')).click();

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


			/*******************Create a New DEAL**********************/
			browser.driver.manage().window().maximize();
			var EC = protractor.ExpectedConditions;

			var dealAddLink = element(by.xpath('//a[@ui-sref="dashboard.deal.add"]'));
			browser.wait(EC.visibilityOf(dealAddLink), 5000);
			dealAddLink.click();

			browser.sleep(5000);
			
			//Start filling inputs
			element(by.model('vm.form.name')).sendKeys('TEST DEAL');
			element(by.model('vm.form.link')).sendKeys('http://localhost:8080/#!/dashboard/deal/add');

			////////Verfiy the validations are working
			element(by.xpath('//div[contains(@class, "form-actions")]//button')).click(); //Click add button
			browser.sleep(100);
			expect(element(by.model('vm.form.description')).getAttribute('class')).toContain('ng-invalid');
			expect(browser.getCurrentUrl()).toContain('dashboard/deal/add');

			element(by.model('vm.form.description')).sendKeys('TEST Description');
			//////////////////////////////////
			
			///Verify Price validation
			element(by.xpath('//div[contains(@class, "form-actions")]//button')).click(); //Click add button
			browser.sleep(100);
			expect(element(by.model('vm.form.price')).getAttribute('class')).toContain('ng-invalid'); //Required
			expect(browser.getCurrentUrl()).toContain('dashboard/deal/add');

			element(by.model('vm.form.price')).sendKeys('Non number');
			element(by.xpath('//div[contains(@class, "form-actions")]//button')).click(); //Click add button
			browser.sleep(100);
			expect(element(by.model('vm.form.price')).getAttribute('class')).toContain('ng-invalid-number'); //Should be number
			expect(browser.getCurrentUrl()).toContain('dashboard/deal/add');
			//////////////////////////////////

			// helpers.clearInput(element(by.model('vm.form.price')));
			element(by.model('vm.form.price')).sendKeys(protractor.Key.BACK_SPACE + protractor.Key.BACK_SPACE)
			element(by.model('vm.form.price')).sendKeys(1);
			element(by.model('vm.form.amazon_rating')).sendKeys(1);
			element(by.model('vm.form.date_starts')).sendKeys(moment().format('YYYY-MM-DD'));
			element(by.model('vm.form.date_ends')).sendKeys(moment().day(1).format('YYYY-MM-DD'));


			////////Verfiy the brand validation is working
			// element(by.xpath('//div[contains(@class, "form-actions")]//button')).click(); //Click add button
			// browser.sleep(3000);
			// expect(element(by.model('vm.form.brand_id')).getAttribute('class')).toContain('ng-invalid');
			// expect(browser.getCurrentUrl()).toContain('dashboard/deal/add');

			selectDropdownByNumber(element(by.model('vm.form.brand_id')), 1, 1000);
			selectDropdownByNumber(element(by.model('vm.form.category_id')), 1, 1000);

			//Add Button
			browser.sleep(2000);
			element(by.xpath('//div[contains(@class, "form-actions")]//button')).click();
			browser.sleep(4000);

			expect(browser.getCurrentUrl()).toContain('/dashboard/deal');
			expect(element.all(by.xpath('//a[@ng-click="vm.deleteDeal($event.currentTarget, deal)"]')).then(function(buttons){ return buttons.length;})) 
			.toBeGreaterThanOrEqual(1);



			/*******************Update a New DEAL**********************/
			element(by.xpath('//a[@ui-sref="dashboard.deal"]')).click();
			browser.sleep(5000);

			element(by.xpath('//a[@ui-sref="dashboard.deal.edit({id:deal.uid})"]')).click();
			element(by.model('vm.form.name')).sendKeys(' Updated');

			browser.sleep(2000);

			//Edit Button
			browser.sleep(500);
			element(by.xpath('//div[contains(@class, "form-actions")]//button')).click();

			browser.sleep(4000);

			expect(browser.getCurrentUrl()).toContain('/dashboard/deal');
			expect(element(by.binding('deal.name')).getText())
			.toEqual('TEST DEAL Updated');

		});

	});


	it('test on jasmine', function(){
		expect('/dashboard/deal').toContain('/dashboard/deal');
	})


});	