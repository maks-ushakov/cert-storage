var CertStorage = (function (undefined) {
	var model;
	return {
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
