
import * as mongoose from 'mongoose'
import { AssetSchema } from './asset'

const UnitSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   assets: [AssetSchema]
})

const UnitModel = mongoose.model("Unit", UnitSchema);

export { UnitSchema, UnitModel }
