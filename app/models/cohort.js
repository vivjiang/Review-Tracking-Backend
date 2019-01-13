import mongoose, { Schema } from 'mongoose';

const CohortSchema = new Schema({
  CohortName: String,
  Locations: {
    type: Array,
    default: [],
  },
}, {
  toJSON: {
    virtuals: true,
  },
});


// create model class
const CohortModel = mongoose.model('Cohort', CohortSchema);

export default CohortModel;
