import { Router } from 'express';

import * as Google from './controllers/google_controller';
import * as Reviews from './controllers/reviews_controller';
import * as Stats from './controllers/stats_controller';

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

router.route('/reviews/graph/location')
  .get(Stats.fetchChartDataLocation);

router.route('/reviews/graph/cohort')
  .get(Stats.fetchChartDataCohort);
export default router;
