var CertStorageView = (function(undefined) {
	var defaultOptions = {
		templateList : '{{#each keys}}<div data-key="{{this.key}}">{{this.fullName}}</div>{{/each}}',
		templateInfo : '<p>{{serialNumber}}</p><p>{{subject.commonName}}</p>',
	}

	function CertStorageView (model, options) {
		this._options = Object.assign({}, defaultOptions, options);
		this.model = model;
		this.model.sender.addListener('certData-loaded', this.renderList.bind(this));
		this.model.sender.addListeners('certAdd-done', [this.renderList.bind(this), hideAddStatus.bind(this)]);
		this.model.sender.addListener('cert-error', this.renderError);

	}

	function showAddStatus () {
		this._options.root.classList.add('cert--add');
	}

	function hideAddStatus () {
		this._options.root.classList.remove('cert--add');
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

	CertStorageView.prototype.renderError = function (err) {
		console.error('Certificate Storage Error:\n', err.message, err);
	}
	return CertStorageView;
})();
