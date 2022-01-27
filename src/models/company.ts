import * as mongoose from 'mongoose'
import { UserSchema } from './user';
import { UnitSchema } from './unit'

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  users: [UserSchema],
  units: [UnitSchema]
})

const CompanyModel = mongoose.model("Company", CompanySchema);

export { CompanyModel }
