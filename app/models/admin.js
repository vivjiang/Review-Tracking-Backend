import mongoose, { Schema } from 'mongoose';

const AdminSchema = new Schema({
  UserName: String,
  GoogleAccessToken: String,
  GoogleRefreshToken: String,
}, {
  toJSON: {
    virtuals: true,
  },
});


// create model class
const AdminModel = mongoose.model('Admin', AdminSchema);

export default AdminModel;
