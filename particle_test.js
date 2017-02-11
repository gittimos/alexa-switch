const p = require('./particle.js');
//const rp = require('request-promise');

const password = process.env.PASSWORD;
const username = process.env.USERNAME;
const deviceid = process.env.DEVICEID;
const apifunction = process.env.APIFUNCTION;

p.particle_get_token(username,password).then(access_token => {
		// console.log(`Access token: ${access_token}`);
		p.particle_function_call(access_token,deviceid,apifunction).then(body => {});
	}
);
