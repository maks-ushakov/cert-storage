/**
 * Bunch of methods to grab info from certificate
 */
var Certificate = (function(undefined){

	var Certificate = {};

	/**
	 * Get serial Number
	 *
	 * @param (ASN1 Object) asn - Certificate data
	 *
	 * @return (string)
	 */
	Certificate.getSerialNumber = function (asn) {
		return asn.sub[0].sub[1].content().replace(/.*\s(\d*)$/, '$1');
	};

	/**
	 * @private
	 * Get certificate info from section (issuer, subject)
	 *
	 * @param (link) - link to decoded ASN1 section
	 *
	 * @return (Object) - Keys is ASN1 paramener, value is ASN1 value
	 */
	var getSectionInfo = function (section) {
		var info = {};
		section.sub.forEach(function(item) {
			var property = oids[item.sub[0].sub[0].content()].d
			info[property] = item.sub[0].sub[1].content();
		});
		return info;
	};

	/**
	 * Get information about Issuer
	 *
	 * @param (ASN1 Object) asn
	 *
	 * @return (Object)
	 */
	Certificate.getIssuerInfo = function (asn) {
		return getSectionInfo(asn.sub[0].sub[3]);
	};

	/**
	 * Get information about Subject
	 *
	 * @param (ASN1 Object) asn
	 *
	 * @return (Object)
	 */
	Certificate.getSubjectInfo = function (asn) {
		return getSectionInfo(asn.sub[0].sub[5]);
	};

	/**
	 * Get info about validity
	 *
	 * @param (ASN1 Object)
	 *
	 * @return (Object) - value is Date
	 */
	Certificate.getValidity = function (asn) {
		var section = asn.sub[0].sub[4];
		return {
			fromDate: section.sub[0].content(),
			tillDate: section.sub[1].content()
		};
	};

	/**
	 * Get full TBS info
	 *
	 * @param (ASN1 Object)
	 *
	 * @return (Object)
	 */
	Certificate.getTBSInfo = function (asn) {
		return {
			serialNumber: Certificate.getSerialNumber(asn),
			issuer: Certificate.getIssuerInfo(asn),
			validity: Certificate.getValidity(asn),
			subject: Certificate.getSubjectInfo(asn)
		};
	};

	/**
	 * Create Uniq Certificate ID for CertStorage
	 * serialNumber and Issuer serialNumber gets uniq sertificate
	 * prefix for saving
	 * delimiter to separate items
	 * Subject commonName for humans reading
	 *
	 * @example
	 * prefix|issuer.serialNumber|serialNumber|subject.commonName
	 *
	 * @param (ASN1 Raw Data) - data from sertificate's body
	 * @param (Object) [optional] options
	 *
	 * @return (String)
	 */
	Certificate.getUID = function (stream, options) {
		var options = Object.assign({}, {prefix: '_', delimiter: '|'}, options)
		var asn = ASN1.decode(stream);
		var issuerSN = Certificate.getIssuerInfo(asn).serialNumber,
			serialNumber = Certificate.getSerialNumber(asn),
			subjectCN = Certificate.getSubjectInfo(asn).commonName.replace(' ', '_');

		return [options.prefix,issuerSN,serialNumber,subjectCN].join(options.delimiter);
	}

	return Certificate;
})();
