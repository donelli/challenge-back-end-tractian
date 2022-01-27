import * as mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   }
})

const UserModel = mongoose.model("User", UserSchema);

export { UserSchema, UserModel }
