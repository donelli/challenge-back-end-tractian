import { Schema, model } from 'mongoose'

interface User {
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
