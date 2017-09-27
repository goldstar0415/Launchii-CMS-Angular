
module.exports = {
	selectDropdownByNumber: function(element, index, milliseconds) {
		element.all(by.tagName('option'))
	  .then(function(options) {
	    options[index].click();
	  });
	    if (typeof milliseconds !== 'undefined') {
	      browser.sleep(milliseconds);
	   }
	},

	clearInput: function (elem) {
	  elem.getAttribute('value').then(function (text) {
	    var len = text.length
	    var backspaceSeries = Array(len+1).join(protractor.Key.BACK_SPACE);
	    elem.sendKeys(backspaceSeries);
	  })
	}
}