
import * as AWS from 'aws-sdk'
import * as fs from 'fs';

const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: process.env.AWS_REGION });

export async function storeFileAtBucket(fileName: string, filePath: string) {
   
   const fileContent = fs.readFileSync(filePath);

   const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: fileContent,
   };
   
   const data = await s3.upload(params).promise();
   
   return data.Location;
   
};

export async function deleteFileFromBucket(fileName: string) {
   return new Promise<void>((resolve, reject) => {
      
      s3.deleteObject({
         Bucket: process.env.AWS_S3_BUCKET,
         Key: fileName,
      }, function(err, data) {
         
         if (err) {
            return reject(err);
         }
         
         resolve();
         
      })
      
   });
};
