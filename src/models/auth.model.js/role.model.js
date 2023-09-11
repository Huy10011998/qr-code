import mongoose from "mongoose";

const { Schema } = mongoose;

const RoleSchema = new Schema({
  name: { type: String, required: true }
});

const Role = mongoose.model('Role', RoleSchema);

export default Role;