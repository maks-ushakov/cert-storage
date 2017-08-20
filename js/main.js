window.addEventListener('load', function() {
	var appRoot = document.getElementById('cert-storage');
	CertStorage.init({
		root: appRoot,
		output: appRoot.querySelector('#cert__info'),
		templateInfo: document.querySelector('#info-template').innerHTML,
		list: appRoot.querySelector('#cert__list-container'),
		templateList: document.querySelector('#list-template').innerHTML,
	});
	CertStorage.run();
}, false)
