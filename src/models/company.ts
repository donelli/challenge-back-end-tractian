import { Schema, model } from 'mongoose'
import { User, UserSchema } from './user';
import { Unit, UnitSchema } from './unit'

interface Company {
  name: string,
  users: User[],
  units: Unit[]
  createdAt?: Date,
  updatedAt?: Date,
}

const CompanySchema = new Schema<Company>({
  name: {
    type: String,
    required: true
  },
  users: [UserSchema],
  units: [UnitSchema]
}, {
  timestamps: true
})

const CompanyModel = model("Company", CompanySchema);

export { CompanyModel }
