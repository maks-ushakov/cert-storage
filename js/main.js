/**
 * Main page script.
 */
 
window.addEventListener('load', function() {

	/** Get DOM element who represent CertStorage application */
	var appRoot = document.getElementById('cert-storage');

	/** Setup and run application */
	CertStorage.init({
		root: appRoot,
		output: appRoot.querySelector('[data-role="certificate-info"]'),
		templateInfo: document.querySelector('#info-template').innerHTML,
		list: appRoot.querySelector('[data-role="certificate-list"]'),
		templateList: document.querySelector('#list-template').innerHTML,
	});

	CertStorage.run();
}, false)
