import { Router } from 'express';

import * as Google from './controllers/google_controller';
import * as Reviews from './controllers/reviews_controller';

const router = Router();


router.route('/google/auth')
  .post(Google.fetchGoogleTokens);

// router.route('/google/refresh')
//   .get(Google.refreshData);

router.route('/reviews/table/all')
  .get(Reviews.fetchAllReviews);

router.route('/reviews/ranking')
  .get(Reviews.fetchLocationStats);

router.route('/reviews/update')
  .get(Reviews.fetchRecentReviews);

router.route('/reviews/graph/cumulative/all')
  .get(Reviews.cumulativePercentAll);
export default router;
