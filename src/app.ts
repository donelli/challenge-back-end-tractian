
import * as express from 'express'
import { initMongoose } from './config/db';
import * as dotenv from 'dotenv'
import { mainRouter } from './routes';

// TODO uggly error showing on invalid JSON input 

dotenv.config()

const app = express()
app.use(express.json());

initMongoose()
.then(() => {

   const PORT = process.env.PORT
   
   app.use('/api/v1/', mainRouter);

   app.listen(PORT, () => console.log(`app running on port ${PORT}`))
   
})
.catch(err => {
   console.error(err);
});
