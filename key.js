var fs = require('fs')
var jwk = require('node-jose').JWK

// Generate the json web key and save it in the current directory.
// Note: The algorithm must be set to "RSA" since it's the only type that aliyun API gateway support. 
jwk.createKeyStore().generate('RSA', 2048).
    then(function(key) {
        publicKey = key.toJSON();
        privateKey = key.toJSON(true);

        console.log("=========================");
        console.log("Public Key:");
        console.log(publicKey);
        console.log("=========================");

        console.log("=========================");
        console.log("Private Key:");
        console.log(privateKey);
        console.log("=========================");

        // Save the key with json and pem format.
        fs.writeFileSync("public_key.json", JSON.stringify(publicKey));
        fs.writeFileSync("private_key.json", JSON.stringify(privateKey));
    });
