(function(undefined){
	function CertStorage () {
		this.keys = [];
		this.load();
		this.keys.sort();
	};

	CertStorage.prototype.load = function () {
		for(var i = 0; i < localStorage.length; i++) {
			this.keys[i] = localStorage.key(i);		
			}
	}
	CertStorage.prototype.add = function (file, filebody) {
		console.log(file, filebody);

		try {
			localStorage.setItem(file.name, JSON.stringify(filebody));
			this.keys.push(file.name);
		} catch (e) {
			console.error('Localstorage Error:' + e);
		}
	};

	window.CertStorage = CertStorage;
})();

(function(undefined) {
	function CertStorageView (infobox) {
		this.out = infobox;
	}
	CertStorageView.prototype.render = function () {
		
	}
	window.CertStorageView = CertStorageView;
})();
function switchStatus(oldstatus, newstatus, target) {
	return function (e) {
		target.classList.add('cert--' + newstatus);
		target.classList.remove('cert--' + oldstatus);
	};
}

window.addEventListener('load', function () {
	// Mediator
	var app = document.getElementById('cert-storage');
	var certStorage = new CertStorage();

	// Buttons
	app.querySelector('#add-certificate').addEventListener('click', switchStatus('show','add', app), false);

	app.querySelector('#cancel-certificate').addEventListener('click', switchStatus('add','show', app), false);

	// drag and drop
	var loadbox;

	loadbox = document.getElementById("cert__load");
	loadbox.addEventListener("dragenter", dragenter, false);
	loadbox.addEventListener("dragover", dragover, false);
	loadbox.addEventListener("drop", drop, false);

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

}, false);
