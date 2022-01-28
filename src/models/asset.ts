
import { Schema, model } from 'mongoose'

interface Asset {
   name: string,
   description: string,
   model: string,
   owner: string,
   status: string,
   image: string,
   health_level: Number,
}

const AssetSchema = new Schema<Asset>({
   name: {
      type: String,
      required: true
   },
   description: {
      type: String,
      required: true
   },
   model: {
      type: String,
      required: true
   },
   owner: {
      type: String,
      required: true
   },
   status: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: true
   },
   health_level: {
      type: Number,
      required: true
   }
})

const AssetModel = model("Asset", AssetSchema);

export { AssetSchema, AssetModel, Asset }
