
import * as mongoose from 'mongoose'

const AssetSchema = new mongoose.Schema({
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

const AssetModel = mongoose.model("Asset", AssetSchema);

export { AssetSchema, AssetModel }
