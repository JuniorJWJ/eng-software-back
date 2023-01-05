const Product = require('../model/Product');
const Store = require('../model/Store');
const ProductService = require('../services/ProductService');

////aws
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = {
  async create(request, response) {
    console.log('oi');
    const image = {
      imageURL: request.file.location,
      imageKey: request.file.key,
    };
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: image.imageKey,
    });
    const url = await getSignedUrl(s3, command, {
      expiresIn: 6 * 86400,
    }); // expires in seconds
    response.json({ url: url });
  },
};
