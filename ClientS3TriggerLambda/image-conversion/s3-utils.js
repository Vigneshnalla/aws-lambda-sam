const aws = require('aws-sdk'),
  fs = require('fs'),
  s3 = new aws.S3(),
  downloadFileFromS3 = function (bucket, fileKey, filePath) {
    console.log('downloading', bucket, fileKey, filePath);
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath),
        stream = s3.getObject({
          Bucket: bucket,
          Key: fileKey
        }).createReadStream();
      stream.on('error', reject);
      file.on('error', reject);
      file.on('finish', () => {
        console.log('downloaded', bucket, fileKey);
        resolve(filePath);
      });
      stream.pipe(file);
    });
  },
  uploadFileToS3 = function (bucket, fileKey, filePath, contentType) {
    console.log('uploading', bucket, fileKey, filePath);
    return s3.upload({
      Bucket: bucket,
      Key: fileKey,
      Body: fs.createReadStream(filePath),
      ACL: 'private',
      ContentType: contentType
    }).promise();
  };

module.exports = {
  downloadFileFromS3: downloadFileFromS3,
  uploadFileToS3: uploadFileToS3
};