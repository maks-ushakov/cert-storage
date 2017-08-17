window.Certificate = (function(undefined){

	var Certificate = {};


	Certificate.getSerialNumber = function (asn) {
		return asn.sub[0].sub[1].content().replace(/.*\s(\d*)$/, '$1');
	};

	var getSectionInfo = function (section) {
		var info = {};
		section.sub.forEach(function(item) {
			var property = oids[item.sub[0].sub[0].content()].d
			info[property] = item.sub[0].sub[1].content();
		});
		return info;
	};

	Certificate.getIssuerInfo = function (asn) {
		return getSectionInfo(asn.sub[0].sub[3]);
	};

	Certificate.getSubjectInfo = function (asn) {
		return getSectionInfo(asn.sub[0].sub[5]);
	};

	Certificate.getValidity = function (asn) {
		var section = asn.sub[0].sub[4];
		return {
			fromDate: section.sub[0].content(),
			tillDate: section.sub[1].content()
		};
	};

	Certificate.getTBSInfo = function (asn) {
		return {
			serialNumber: Certificate.getSerialNumber(asn),
			issuer: Certificate.getIssuerInfo(asn),
			validiti: Certificate.getValidity(asn),
			subject: Certificate.getSubjectInfo(asn)
		};
	};

	Certificate.getUID = function (stream) {
		var asn = ASN1.decode(stream);
		var issuerSN = Certificate.getIssuerInfo(asn).serialNumber,
			serialNumber = Certificate.getSerialNumber(asn),
			subjectCN = Certificate.getSubjectInfo(asn).commonName.replace(' ', '_');

		console.log('cert_:' + issuerSN + ':' + serialNumber + ':' + subjectCN);
		return 'cert_:' + issuerSN + ':' + serialNumber + ':' + subjectCN;
	}

	return Certificate;
})();
