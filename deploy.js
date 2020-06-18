AWS = require('aws-sdk') 
files = require('./files.json')
fs = require('fs')

AWS.config.apiVersions = {
    s3: '2006-03-01',
    // other service API versions
};
AWS.config.loadFromPath('./credential.json')

var s3 = new AWS.S3();

function stringToBinary(str, spaceSeparatedOctets) {
  /**
 * Function that converts a string into its binary representation
 * 
 * @see https://gist.github.com/eyecatchup/6742657
 * @author https://github.com/eyecatchup
 */
  function zeroPad(num) {
      return "00000000".slice(String(num).length) + num;
  }
  return str.replace(/[\s\S]/g, function(str) {
      str = zeroPad(str.charCodeAt().toString(2));
      return !1 == spaceSeparatedOctets ? str : str + ""
  });
};

/* The following example creates an object. If the bucket is versioning enabled, S3 returns version ID in response. */
function upload(binary, name, bucketName = 'elshaddai-bling-develop') {
  var params = { Body: binary, Bucket: bucketName, Key: name, ACL: 'public-read' };
  s3.putObject(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

Object.values(files).map(i=>{
  // console.log(stringToBinary(fs.readFileSync(i, 'utf-8')))
  upload(
    fs.readFileSync(i, 'utf-8'),
    i
  )
  // console.log(Object.values(fs.readFileSync(i)))
})