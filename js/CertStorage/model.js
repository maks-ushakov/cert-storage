var CertStorageModel = (function(undefined){
	var defaultOptions = {
		prefix: 'cert_',
		delimiter: ':',
	};

	function Model (options) {
		this._options = Object.assign({}, defaultOptions, options | {});
		this.keys = [];
	}

	// Get subject Common Name using key
	var getFullName = function (key, options) {
		
		return key
			.split(options.delimiter)[3]
			.replace('_', ' ');
	};

	// Sort function
	var byFullName = function (item1, item2) {
		if(item1.fullName === item2.fullName) return 0;
		return item1.fullName > item2.fullName ? 1 : -1;
	};

	var isStorageKey = function (key, options) {
		// Certificate key has prefix and delimiter
		var testPattern = new RegExp('^' + options.prefix + options.delimiter);
		return testPattern.test(key);
	};

	var getUIDs = function (keys) {
		return keys.map(function (item) {return item.key;} );
	}

	// Get list of all key in Storage
	Model.prototype.load = function (callback) {
		for(var i = 0; i < localStorage.length; i++) {

			var key = localStorage.key(i);

			if(isStorageKey(key, this._options)) {
				// load only app certificate keys
				this.keys[i] = { 
					key: key,
					fullName: getFullName(key, this._options),
				};
			}
		}

		this.keys.sort(byFullName);
		
		callback(null,this.keys);
	};


	Model.prototype.add = function (file, filebody) {
		try {
			var uniqName = Certificate.getUID(filebody, this._options),
				keys = getUIDs(this.keys);
			
			if(keys.indexOf(uniqName) !== -1) {
				throw new Error('Certificate already added');
			}

			localStorage.setItem(uniqName, JSON.stringify(filebody));
			this.keys.push(file.name);
		} catch (e) {
			console.error("This certificate can not be added! " + e.message)
		}
	};

	// Return 
	Model.prototype.getInfo = function (key) {
		try {
			var info = JSON.parse(localStorage.getItem(key));
			return Certificate.getTBSInfo(ASN1.decode(info));
		} catch (e) {
			console.error('Can not read certificate info')	
		}
	};

	return Model;
})();
