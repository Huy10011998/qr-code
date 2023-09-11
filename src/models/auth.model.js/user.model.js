import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true },
  fullName: { type: String, required: true },
  fullName_en: { type: String, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  department_en: { type: String, required: true },
  userId: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

export default User;