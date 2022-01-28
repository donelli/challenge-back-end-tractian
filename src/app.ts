
import * as express from 'express'
import { initMongoose } from './config/db';
import { companyRouter } from './routes/company'

// TODO uggly error showing on invalid JSON input 

const app = express()
app.use(express.json());

initMongoose()
.then(() => {

   const PORT = process.env.PORT
   
   app.use('/api/company', companyRouter);

   app.listen(PORT, () => console.log(`app running on port ${PORT}`))
   
})
.catch(err => {
   console.error(err);
});
