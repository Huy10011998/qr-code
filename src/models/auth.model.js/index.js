import mongoose from "mongoose";
import User from "./user.model";
import Role from "./role.model";

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.user = User;
db.role = Role;

db.ROLES = ["user", "admin", "moderator"];

export default db;