'use strict';
const AWS = require('aws-sdk');
const ecr = new AWS.ECR({apiVersion: '2015-09-21'});

module.exports.index = (event, context, callback) => {
  const threshold = process.env.DELETE_THRESHOLD;
  const removeCount = process.env.DELETE_COUNT;
  const repositoryName = process.env.REPO_NAME;

  console.log(`Processing ${repositoryName} ECR repository...`);

  const listImagesParams = {
    repositoryName,
    maxResults: 100,
  };

  ecr.describeImages(listImagesParams).promise().then((data) => {
    if (data.imageDetails.length < threshold) return callback(null, {
      body: `${data.imageDetails.length} images in repository, at least ${threshold} are needed to delete, skipping...`,
    });

    const sortedImages = data.imageDetails.sort((a, b) =>
      new Date(a.imagePushedAt) - new Date(b.imagePushedAt)
    );

    const imagesToBeRemoved = sortedImages.slice(0, removeCount);

    console.log(`Removing ${removeCount} images. List: `);
    console.log(imagesToBeRemoved);

    const batchDeleteParams = {
      repositoryName,
      imageIds: imagesToBeRemoved.map(image => ({
        imageDigest: image.imageDigest,
      })),
    };

    ecr.batchDeleteImage(batchDeleteParams).promise().then((data) => {
      console.log(data);
      callback(null, data);
    }).catch((err) => callback(err, err.stack));
  }).catch((err) => callback(err, err.stack));
};
