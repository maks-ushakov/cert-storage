/**
 * Application start point
 *
 *
 * Options:
 * root (DOM Element) - main app container
 * prefix (String) - prefix for Storage
 * delimeter (String) - separator for key
 *
 * loadArea (CSS Selector) - area to drop certificate file
 *
 * buttonAdd (CSS Selector)
 * buttonCancel (CSS Selector)
 *
 * output (DOM Element) - represent area to output info
 * templateInfo (DOM String) - Handlebars notation template string
 *
 * list (DOM Element) - area to output list of certificates in storage
 * templateList (DOM String) 
 *
 */

var CertStorage = (function (undefined) {
	var model;
	return {
		/** Configuration and prepare */
		init: function (options) {
			model = new CertStorageModel();
			var	controller = new CertStorageController(model, options),
				view = new CertStorageView(model, controller, options);
		},

		run: function () {
			model.load();	
		}
	}

})()
