var CertStorageView = (function(undefined) {
	var defaultOptions = {
		templateList : '{{#each keys}}<div data-key="{{this.key}}">{{this.fullName}}</div>{{/each}}',
		templateInfo : '<p>{{serialNumber}}</p><p>{{subject.commonName}}</p>',
	}

	function CertStorageView (model, options) {
		this._options = Object.assign({}, defaultOptions, options);
		this.model = model;
	}

	/**
	 * Out data with template
	 *
	 * @param (DOM Element) target
	 * @param (string) templateSourse
	 * @param (object) data
	 */
	var outData = function (target, templateSource, data) {
		var template = Handlebars.compile(templateSource);
		target.innerHTML = template(data);
	}
	
	CertStorageView.prototype.renderList = function () {
		var list = this._options.list;
		outData(list, this._options.templateList,{keys: this.model.keys});
	};

	CertStorageView.prototype.renderInfo = function (context) {
	//	var context = this.model.getInfo(key);
		outData(this._options.output, this._options.templateInfo, context);
	}
	return CertStorageView;
})();
