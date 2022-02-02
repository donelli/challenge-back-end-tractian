import { Schema, model, Types } from 'mongoose'

interface User {
   id?: Types.ObjectId,
   name: string,
   createdAt?: Date,
   updatedAt?: Date,
}

const UserSchema = new Schema<User>({
   name: {
      type: String,
      required: true
   }
}, {
   timestamps: true
})

const UserModel = model("User", UserSchema);

export { UserSchema, UserModel, User }
