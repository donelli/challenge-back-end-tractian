
import { connect } from 'mongoose'

export function initMongoose() {
   return new Promise<void>((resolve, reject) => {
      
      const mongoDbUrl = process.env.MONGOOSE_URL;
      
      connect(mongoDbUrl, {})
      .then(db => {
         resolve();
      })
      .catch(reject);
      
   });
}
