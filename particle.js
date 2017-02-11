const rp = require('request-promise');
const request = require('request');

exports.particle_get_token = (username,password) => {
	
	const options = {

		method: 'POST',
		uri: 'https://api.particle.io/oauth/token',
		auth: {
			user: 'particle',
			pass: 'particle'
		},
		headers: {
			contentType: 'application/x-www-form-urlencoded',
		},
		form: {
			grant_type: 'password',
	    	username: username,
	    	password: password
		}
	}
	
	return rp(options).then(
		body => {
			const access_token = JSON.parse(body).access_token;
			return access_token;
		},
		err => {
			console.log(`${err}`);
			return(err);
		}
	);
}

exports.particle_function_call = (access_token,deviceid,api_function) => {

	const options = {
	
		method: 'POST',
		uri: `https://api.particle.io/v1/devices/${deviceid}/${api_function}`,
		headers: {
			contentType: 'application/x-www-form-urlencoded',
		},
		form: {
			access_token: access_token,
		}
	}

	return rp(options).then(
		body => {
			return(body);
		}, 
		err => {
			console.log(`${err}`);
			return(err);
		}
	);
};
   