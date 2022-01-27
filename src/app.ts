
import * as express from 'express'
import * as mongoose from 'mongoose'

import { CompanyModel } from './models/company'
import { UserModel } from './models/user'
import { companyRouter } from './routes/company'

const app = express()
app.use(express.json());

// TODO uggly error showing on invalid JSON input 

const PORT = 8080

// TODO place the database logic in a separate file
// TODO load this from .env file
const mongoDbUrl = 'mongodb://localhost:27017/test'

mongoose.connect(mongoDbUrl, {})
.then(async db => {

   // const model = new CompanyModel({
   //    name: 'Teste',
   //    users: [
   //       new UserModel({
   //          name: "donelli"
   //       })
   //    ],
   //    units: []
   // });

   // await model.save();
   
   // const model = await CompanyModel.findOne({})
   
   // model.users.push(new UserModel({
   //    'name': 'william'
   // }));
   // await model.save();

   // const newUser = new UserModel({
   //    name: 'New user'
   // });
   
   // const resp = await newUser.save();

   // const id = resp._id;
   
   // const newCompany = new CompanyModel({
   //    name: 'New company',
   //    users: [],
   //    units: []
   // });

   // await newCompany.save();
   
   // const companyModel = await CompanyModel.findOne({})
   // console.log(companyModel);
   
   // const userModel = new UserModel({
   //    name: "Donelli"
   // })

   // companyModel.users.push(userModel);

   // companyModel.save();
   
   app.use('/api/company', companyRouter);

   
   // app.get('/', (req: express.Request, res: express.Response) => {
   //    res.setHeader('Content-Type', 'text/html')
   //    res.end('<h1>Hello World</h1>')
   // })

   app.listen(PORT, () => console.log(`app running on port ${PORT}`))
   
})
.catch(err => console.log(err))
