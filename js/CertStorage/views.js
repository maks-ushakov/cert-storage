var CertStorageView = (function(undefined) {
	var defaultOptions = {
		templateList : '{{#each keys}}<div data-key="{{this.key}}">{{this.fullName}}</div>{{/each}}',
		templateInfo : '<p>{{serialNumber}}</p><p>{{subject.commonName}}</p>',
	}

	var root;

	function CertStorageView (model, controller, options) {
		this._options = Object.assign({}, defaultOptions, options);
		root = this._options.root;
		this.model = model;
		this.model.sender.addListener('certData-loaded', this.renderList.bind(this));
		this.model.sender.addListener('cert-error', this.renderError);
		this.model.sender.addListeners('add-certificate-done', [this.renderList.bind(this), hideAddStatus.bind(this)]);

		this.ctrl = controller;
		this.ctrl.sender.addListener('add-certificate', showAddStatus.bind(this));
		this.ctrl.sender.addListener('cancel-adding', hideAddStatus.bind(this))
		this.ctrl.sender.addListener('update-list-active', this.updateActiveListItem.bind(this))
		this.ctrl.sender.addListener('info-request', this.renderInfo.bind(this))

	}

	function showAddStatus () {
		root.classList.add('cert--add');
	}

	function hideAddStatus () {
		root.classList.remove('cert--add');
	}

	CertStorageView.prototype.updateActiveListItem = function (target) {
		var list = this._options.list;
		var oldActive = list.querySelector('.active');
		if(oldActive) {
			oldActive.classList.remove('active');
		}
		target.classList.add('active');
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

	CertStorageView.prototype.renderInfo = function (key) {
		var context = this.model.getInfo(key);
		outData(this._options.output, this._options.templateInfo, context);
	}

	CertStorageView.prototype.renderError = function (err) {
		alert('Certificate Storage Error:\n' + err.message)
		console.error('Certificate Storage Error:\n', err.message, err);
	}
	return CertStorageView;
})();
