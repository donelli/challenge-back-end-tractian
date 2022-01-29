import { Schema, model, Types } from 'mongoose'

interface User {
   id?: Types.ObjectId,
   name: string,
}

const UserSchema = new Schema<User>({
   name: {
      type: String,
      required: true
   }
})

const UserModel = model("User", UserSchema);

export { UserSchema, UserModel, User }
