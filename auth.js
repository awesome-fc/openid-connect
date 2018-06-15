'use strict';

var fs = require('fs');
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var path = require('path');

var inited = false;
var keyid = '';   // the key id MUST be the same as one configured in api gateway
var publicKeyPEM = '';
var privateKeyPEM = '';

var init = function() {
  	var dir = process.env['FC_FUNC_CODE_PATH']
    console.log("Read key file from directory: ", dir);
    
    // Read the public jwk(json-web-key) from file and covert it to pem format.
    var publicKeyJWK = JSON.parse(fs.readFileSync(path.join(dir, 'public_key.json'), 'utf8'));
    publicKeyPEM = jwkToPem(publicKeyJWK);
  	console.log("JWK: ", publicKeyJWK);
    console.log("PEM: ", publicKeyPEM);
  
  	// Read the private jwk(json-web-key) from file and covert it to pem format.
    var privateKeyJWK = JSON.parse(fs.readFileSync(path.join(dir, 'private_key.json'), 'utf8'));
    privateKeyPEM = jwkToPem(privateKeyJWK, {private: true});
    console.log("JWK: ", privateKeyJWK);
  	console.log("PEM: ", privateKeyPEM);
  
  	// Extract the json-web-token id from the key.
    var id0 = publicKeyJWK.kid
  	var id1 = privateKeyJWK.kid
  	if (id0 != id1) {
      	errmsg = "Error: different key id between public and private keys. Public key: " + 
          	id0 + " Private key: " + id1
      	console.log(errmsg);
      	throw new Error(errmsg);
    }
  	keyid = id0;
  	console.log("key id: " + keyid);
  
  	// Finally set the flag to make sure init happen only once.
  	inited = true;
}

// Generate the openid token.
var sign = function(event, context, callback) {
    // Generate the token expires in 60 seconds (1 minute).
    // The first argument of sign() is payload. Here we set it empty for demonstration purpose.
    // For detail info, please refer to: https://github.com/auth0/node-jsonwebtoken
    var token = jwt.sign({}, privateKeyPEM, { keyid: keyid, expiresIn: 60, algorithm: 'RS256' });

    console.log("Generate token: ", token);

    var response = {
        isBase64Encoded:false,
        statusCode: 200,
        headers: {
            "x-custom-header" : "header value"
        },
        body: token 
    };
    callback(null, response);
}

var doSth = function(event, context, callback) {
  	var response = {
        isBase64Encoded:false,
        statusCode: 200,
        body: "Congratulations! You pass the authentication of API gateway!" 
    };
  	callback(null, response);
}

module.exports.handler = function(eventBytes, context, callback) {
  	if (inited == false) {
      	init();
    }
    var event = JSON.parse(eventBytes)
    if (event.path == '/signup') {
    	sign(event, context, callback);
    } else {
      	doSth(event, context, callback);
    }
}