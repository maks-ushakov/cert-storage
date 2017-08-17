(function(undefined){
	function CertStorage () {
		this.keys = [];
	}

	CertStorage.prototype.load = function (callback) {
		for(var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i),
				temp = key.split(':'),
				uid = temp[1] + ':' + temp[2],
				fullName = temp[3].replace('_', ' ');

			this.keys[i] = { 
				key: key,
				uid: uid,
				fullName: fullName
			}
		}

		this.keys.sort(function(a,b) {
			if(a.fullName === b.fullName) return 0;
			return a.fullName > b.fullName ? 1 : -1;
		});
		
		callback(null,this.keys);
	};
	CertStorage.prototype.add = function (file, filebody) {

		var uniqName = Certificate.getUID(filebody);

		try {
			localStorage.setItem(uniqName, JSON.stringify(filebody));
			this.keys.push(file.name);
		} catch (e) {
		}
	};

	CertStorage.prototype.getInfo = function (key) {
		var info = JSON.parse(localStorage.getItem(key));
		return Certificate.getTBSInfo(ASN1.decode(info));
	};

	window.CertStorage = CertStorage;
})();

(function(undefined) {
	function CertStorageView (source, option) {
		this.option = Object.assign({}, option);
		this.source = source;
	}
	
	CertStorageView.prototype.renderList = function () {
		var list = this.option.list;
		var listItem;
		this.source.keys.forEach(function (item) {
			listItem = document.createElement('li');
			listItem.innerHTML = item.fullName;
			listItem.dataset.key = item.key;
			list.append(listItem);
		});		
	};

	CertStorageView.prototype.renderInfo = function (context) {
		console.log(context);
		var source   = document.querySelector("#info-template").innerHTML;
		var template = Handlebars.compile(source);
		document.querySelector('#cert__info').innerHTML = template(context);
	}
	window.CertStorageView = CertStorageView;
})();



window.addEventListener('load', function () {
	// Mediator
	var app = document.getElementById('cert-storage');
	var certStorage = new CertStorage();
	var view = new CertStorageView(certStorage ,{
		out: app.querySelector('#cert__info'),
		list: app.querySelector('#cert__list-container ul')});
	certStorage.load(view.renderList.bind(view));

	// Buttons
	app.querySelector('#add-certificate').addEventListener('click', switchStatus('show','add', app), false);

	app.querySelector('#cancel-certificate').addEventListener('click', switchStatus('add','show', app), false);

	// drag and drop
	var loadbox;

	loadbox = document.getElementById("cert__load");
	loadbox.addEventListener("dragenter", dragenter, false);
	loadbox.addEventListener("dragover", dragover, false);
	loadbox.addEventListener("drop", drop, false);


	var list = document.getElementById('cert__list-container');
	list.addEventListener('click', listHandler ,false);

	function dragenter(e) {
		  e.stopPropagation();
		  e.preventDefault();
	}

	function dragover(e) {
		  e.stopPropagation();
		  e.preventDefault();
	}

	function drop(e) {
		  e.stopPropagation();
		  e.preventDefault();

		  var dt = e.dataTransfer;
		  var files = dt.files;

		  read(files[0]);
	}


	function switchStatus(oldstatus, newstatus, target) {
		return function (e) {
			target.classList.add('cert--' + newstatus);
			target.classList.remove('cert--' + oldstatus);
		};
	}

	function read(file) {
		var reader = new FileReader();
		reader.onloadend = function () {
			if (reader.error)
				console.error("Your browser couldn't read the specified file (error code " + r.error.code + ").");
			else {
				certStorage.add(file, reader.result);
				switchStatus('add', 'show', app)();
			}
		};
		reader.readAsBinaryString(file);
	}

	function listHandler(e) {
		var target = e.target;
		var parent = e.currentTarget;
		if(target.tagName == 'LI') {
			var oldActive =	this.querySelector('.active');
			if(oldActive)
				oldActive.classList.remove('active');
			target.classList.add('active');
			view.renderInfo(certStorage.getInfo(target.dataset.key));
		}
	}

}, false);
