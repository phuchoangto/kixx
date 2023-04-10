const { storage } = require('../config/storage');

module.exports = {
  uploadFile: async (image, fileName) => new Promise((resolve, reject) => {
    const file = storage.file(fileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: image.mimetype,
      },
    });

    stream.on('error', (error) => {
      reject(error);
    });

    stream.on('finish', () => {
      console.log('File uploaded successfully');
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/${fileName}?alt=media`;
      resolve(publicUrl);
    });

    stream.end(image.buffer);
  }),
};
