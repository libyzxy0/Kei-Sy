const axios = require("axios");
class Simsimi {
	constructor(message) {
		this.message = message;
	}
	getresponse(callback) {
		let a = axios.get(`https://api.simsimi.net/v2/?text=${this.message}&lc=ph&cf=false&name=Joyce`);
		a.then((response) => {
			callback(response.data.success);
        }) 
	}
}
module.exports = { Simsimi }