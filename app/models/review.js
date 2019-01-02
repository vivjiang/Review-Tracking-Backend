import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema({
  Location: String,
  Date: String,
  Rating: String,
  Content: String,
  Platform: String,
  Period: String,
  Year: Number,
}, {
  toJSON: {
    virtuals: true,
  },
});

ReviewSchema.virtual('score').get(function scoreCalc() {
  return this.upvotes - this.downvotes;
});

// create model class
const ReviewModel = mongoose.model('Review', ReviewSchema);

export default ReviewModel;
