var CertStorageController = (function (undefined) {
	var defaultOptions = {
		buttonAdd: '[data-action="add-certificate"]',
		buttonCancel: '[data-action="cancel-adding"]',
		loadArea: '[data-role="load-area"]'
	};

	/**
	 * @class
	 *
	 * @param (CertStorageModel) model
	 * @param (Object) [optional] options
	 */
	function Controller (model, options) {
		this._options = Object.assign({}, defaultOptions, options);
		this.model = model;
		this.sender = new EventEmitter();
		this.setHandlers();
	}

	function buttonHandler(e) {
		var target = e.target;
		this.sender.emitEvent(target.dataset.action);
	}

	/**
	 * Set DOM handlers
	 */
	Controller.prototype.setHandlers = function () {
		var root = this._options.root,
			_this = this; // cache this

		// handlers for all app button
		var buttons = root.querySelectorAll('button');
		buttons.forEach(function(item) {
			item.addEventListener('click', buttonHandler.bind(_this));
		});

		// drag and drop behevior
		var loadbox;

		loadbox = root.querySelector(this._options.loadArea);
		loadbox.addEventListener("dragenter", dragenter.bind(this), false);
		loadbox.addEventListener("dragover", dragover.bind(this), false);
		loadbox.addEventListener("drop", drop.bind(this), false);
		root.addEventListener('dragover', dragover.bind(this), false);


		// click by certificate's list
		var list = this._options.list;
		list.addEventListener('click', listHandler.bind(this) ,false);
	}

/*
 * private handlers
 */

	function dragenter(e) {
		  e.stopPropagation();
		  e.preventDefault();
	}

	function dragover(e) {
		  e.stopPropagation();
		  e.preventDefault();
		this.sender.emitEvent('add-certificate');
	}

	function drop(e) {
		  e.stopPropagation();
		  e.preventDefault();

		  var dt = e.dataTransfer;
		  var files = dt.files;

		  this.model.append(files[0]);
	}


	function listHandler(e) {
		var target = e.target;
		if(target.dataset.key) {
			this.sender.emitEvent('update-list-active',[target]);	
			this.sender.emitEvent('info-request',[target.dataset.key]);
		}
	}

	return Controller;
})();
