
import { Schema, model } from 'mongoose'
import { Asset, AssetSchema } from './asset'

interface Unit {
   name: string,
   assets: Asset[]
}

const UnitSchema = new Schema<Unit>({
   name: {
      type: String,
      required: true
   },
   assets: [AssetSchema]
})

const UnitModel = model("Unit", UnitSchema);

export { UnitSchema, UnitModel, Unit }
