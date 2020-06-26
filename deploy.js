AWS = require('aws-sdk') 
files = require('./files.json')
fs = require('fs')

const BUCKET_NAME = 'elshaddai-bling-develop'
AWS.config.apiVersions = { s3: '2006-03-01' };
AWS.config.loadFromPath('./credential.json')
var s3 = new AWS.S3();

/* The following example creates an object. If the bucket is versioning enabled, S3 returns version ID in response. */
function upload(binary, name, bucketName = BUCKET_NAME) {
  var params = { Body: binary, Bucket: bucketName, Key: name, ACL: 'public-read'};
  s3.putObject(params, function(err, data) {
    if (err) console.log(err, err.stack); else console.log(data);// Error || successful response
  });
}

var params = { Bucket: BUCKET_NAME, CORSConfiguration: { CORSRules: [{ AllowedHeaders: [ "Authorization" ], AllowedMethods: [ "GET" ], AllowedOrigins: [ "*" ], MaxAgeSeconds: 3000 }] }};
s3.putBucketCors(params, function(err, data) {
  if (err) console.log(err, err.stack); else console.log('Success - ', data)// Error || successful response
});

Object.values(files).map(i=>{
  upload(fs.readFileSync(i, 'utf-8'), i)
})
