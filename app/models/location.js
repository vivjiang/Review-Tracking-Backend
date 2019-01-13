import mongoose, { Schema } from 'mongoose';

const LocationSchema = new Schema({
  Location: String,
  Stats: {
    type: Array,
    default: [],
  },
}, {
  toJSON: {
    virtuals: true,
  },
});


// create model class
const LocationModel = mongoose.model('Location', LocationSchema);

export default LocationModel;
