
import { Schema, model, Types } from 'mongoose'
import { Asset, AssetSchema } from './asset'

interface Unit {
   id?: Types.ObjectId,
   name: string,
   assets: Asset[],
   createdAt?: Date,
   updatedAt?: Date,
}

const UnitSchema = new Schema<Unit>({
   name: {
      type: String,
      required: true
   },
   assets: [AssetSchema]
}, {
   timestamps: true
})

const UnitModel = model("Unit", UnitSchema);

export { UnitSchema, UnitModel, Unit }
