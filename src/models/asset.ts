
import { Schema, model, Types } from 'mongoose'
import { User } from './user';

export enum AssetStatus {
   RUNNING = 'RUNNING',
   ALERTING = 'ALERTING',
   STOPPED = 'STOPPED'
}
 
interface Asset {
   id?: Types.ObjectId,
   _id?: Types.ObjectId,
   name: string,
   description: string,
   model: string,
   owner: User,
   status: AssetStatus,
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
      type: Schema.Types.ObjectId,
      required: true
   },
   status: {
      type: String,
      enum: AssetStatus,
      default: AssetStatus.STOPPED,
      required: true
   },
   image: {
      type: String,
      required: true
   },
   health_level: {
      type: Number,
      required: true,
      default: 100
   }
})

const AssetModel = model("Asset", AssetSchema);

export { AssetSchema, AssetModel, Asset }
