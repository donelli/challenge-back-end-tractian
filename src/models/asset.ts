
import { Schema, model } from 'mongoose'
import { User } from './user';

export enum AssertStatus {
   RUNNING = 'RUNNING',
   ALERTING = 'ALERTING',
   STOPPED = 'STOPPED'
}
 
interface Asset {
   name: string,
   description: string,
   model: string,
   owner: User,
   status: AssertStatus,
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
      enum: AssertStatus,
      default: AssertStatus.STOPPED,
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
