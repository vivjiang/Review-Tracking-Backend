import Review from '../models/Review';

const locationNames = [
  'Granbury', 'Abilene', 'Greenville', 'Palestine', 'Brownwood',
  'Midland', 'Grapevine', 'Frisco', 'Arlington', 'Grapevine Main St',
  'Ennis', 'Nacogdoches', 'Lubbock', 'Mansfield', 'College Station',
  'Athens', 'Longview', 'Allen', 'Burleson', 'Cleburne', 'Georgetown',
  'North Richland Hills', 'Cedar Hill', 'McKinney', 'Claremore', 'Lewisville',
  'Ada', 'San Angelo', 'Corsicana', 'Rockwall', 'Bryan', 'Denison',
  'Plainview', 'Watauga', 'Siloam Springs', 'Flower Mound', 'Spring', 'Henderson',
  'Lake Worth', 'Stephenville', 'Clovis', 'Tyler', 'Weatherford', 'Waco',
  'Wichita Falls', 'Springdale', 'Waxahachie', 'Chickasha', 'Wylie', 'Ardmore',
  'Broken Arrow', 'Lufkin', 'Hobbs', 'Round Rock', 'Temple',
];


export function fetchAllReviews(req, res) {
  // console.log('in fetchAllReviews');
  Review.find({}).then((response) => {
    // console.log('fetchAllReviews');
    const reviews = {};
    for (let i = 0; i < response.length; i += 1) {
      if (response[i].Year >= 2017) {
        const location = String(response[i].Location);
        if (location in reviews) {
          if ((response[i].Rating === 'ONE') || (response[i].Rating === 'TWO') || (response[i].Rating === 'negative') ||
          (response[i].Rating === '2.0 star rating') || (response[i].Rating === '1.0 star rating')) {
            reviews[location].NumNeg += 1;
          } else if ((response[i].Rating === 'FIVE') || (response[i].Rating === 'FOUR') || (response[i].Rating === 'positive') ||
          (response[i].Rating === '4.0 star rating') || (response[i].Rating === '5.0 star rating')) {
            reviews[location].NumPos += 1;
          }
          reviews[location].NumTotal += 1;
          reviews[location].PercentNeg = reviews[location].NumNeg / reviews[location].NumTotal;
          reviews[location].PercentPos = reviews[location].NumPos / reviews[location].NumTotal;
        } else {
          let numPos = 0;
          let numNeg = 0;
          let numTotal = 0;
          if ((response[i].Rating === 'ONE') || (response[i].Rating === 'TWO') || (response[i].Rating === 'negative') ||
          (response[i].Rating === '2.0 star rating') || (response[i].Rating === '1.0 star rating')) {
            numPos = 1;
          } else if ((response[i].Rating === 'FIVE') || (response[i].Rating === 'FOUR') || (response[i].Rating === 'positive') ||
          (response[i].Rating === '4.0 star rating') || (response[i].Rating === '5.0 star rating')) {
            numNeg = 1;
          }
          numTotal = 1;
          reviews[location] = {
            NumNeg: numNeg, NumPos: numPos, NumTotal: numTotal, PercentNeg: numNeg / numTotal, PercentPos: numPos / numTotal,
          };
        }
      }
    }
    // console.log(reviews);
    res.json(reviews);
  }).catch((error) => {
    console.log(error);
  });
}

export function cumulativePercentAll(req, res) {
  // console.log('in cumulative percent negative default');
  Review.find({}).then((response) => {
    const cumulativePercent = {};
    for (let i = 0; i < response.length; i += 1) {
      if (response[i].Location === 'Midland' && (response[i].Year >= 2017)) {
        // const month = response[i].Date.getMonth();
        // const year = response[i].Date.getFullYear();
        // console.log(response[i]);
        // const date = new Date(year, month);
        const period = response[i].Period;
        const year = response[i].Year;
        const date = `${period} ${year}`;
        if (date in cumulativePercent) {
          if ((response[i].Rating === 'ONE') || (response[i].Rating === 'TWO') || (response[i].Rating === 'negative') ||
          (response[i].Rating === '2.0 star rating') || (response[i].Rating === '1.0 star rating')) {
            // console.log('in dict negative', response[i]);
            cumulativePercent[date].NumNeg += 1;
          } else if ((response[i].Rating === 'FIVE') || (response[i].Rating === 'FOUR') || (response[i].Rating === 'positive') ||
          (response[i].Rating === '4.0 star rating') || (response[i].Rating === '5.0 star rating')) {
            cumulativePercent[date].NumPos += 1;
          }
          cumulativePercent[date].NumTotal += 1;
        } else {
          let numPos = 0;
          let numNeg = 0;
          let numTotal = 0;
          if ((response[i].Rating === 'ONE') || (response[i].Rating === 'TWO') || (response[i].Rating === 'negative') ||
          (response[i].Rating === '2.0 star rating') || (response[i].Rating === '1.0 star rating')) {
            numNeg = 1;
          } else if ((response[i].Rating === 'FIVE') || (response[i].Rating === 'FOUR') || (response[i].Rating === 'positive') ||
          (response[i].Rating === '4.0 star rating') || (response[i].Rating === '5.0 star rating')) {
            numPos = 1;
          }
          numTotal = 1;
          cumulativePercent[date] = {
            NumNeg: numNeg, NumPos: numPos, NumTotal: numTotal,
          };
        }
      }
    }
    // console.log('finished calculating', cumulativePercent);
    const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13'];
    const years = [2017, 2018];
    for (let i = 0; i < years.length; i += 1) {
      for (let j = 0; j < periods.length; j += 1) {
        const date = `${periods[j]} ${years[i]}`;
        // console.log('date', date);
        cumulativePercent[date].CumulativeNumPos = cumulativePercent[date].NumPos;
        cumulativePercent[date].CumulativeNumNeg = cumulativePercent[date].NumNeg;
        cumulativePercent[date].CumulativeTotal = cumulativePercent[date].NumTotal;
        if (j !== 0) {
          const prevDate = `${periods[j - 1]} ${years[i]}`;
          // console.log(cumulativePercent[prevDate]);
          cumulativePercent[date].CumulativeNumPos += cumulativePercent[prevDate].CumulativeNumPos;
          cumulativePercent[date].CumulativeNumNeg += cumulativePercent[prevDate].CumulativeNumNeg;
          cumulativePercent[date].CumulativeTotal += cumulativePercent[prevDate].CumulativeTotal;
        } else if (j === 0 && i === 1) {
          const prevDate = `${periods[periods.length - 1]} ${years[i - 1]}`;
          cumulativePercent[date].CumulativeNumPos += cumulativePercent[prevDate].CumulativeNumPos;
          cumulativePercent[date].CumulativeNumNeg += cumulativePercent[prevDate].CumulativeNumNeg;
          cumulativePercent[date].CumulativeTotal += cumulativePercent[prevDate].CumulativeTotal;
        }
        cumulativePercent[date].CumulativePercentPos = (cumulativePercent[date].CumulativeNumPos / cumulativePercent[date].CumulativeTotal);
        cumulativePercent[date].CumulativePercentNeg = (cumulativePercent[date].CumulativeNumNeg / cumulativePercent[date].CumulativeTotal);
      }
    }
    res.json(cumulativePercent);
  }).catch((error) => {
    console.log(error);
  });
}

export function fetchRecentReviews(req, res) {
  console.log('in fetchRecentReviews', req.query.day);
  const dateString = req.query.day;
  console.log('dateString', dateString);

  Review.find({ Date: dateString }).then((response) => {
    const stats = {
      NumNeg: 0,
      NumPos: 0,
      NumNeutral: 0,
      Total: response.length,
    };

    const reviews = {
      Positive: [],
      Negative: [],
      Neutral: [],
    };
    console.log('response', response.length);
    for (let i = 0; i < response.length; i += 1) {
      if ((response[i].Rating === 'ONE') || (response[i].Rating === 'TWO') || (response[i].Rating === 'negative') ||
      (response[i].Rating === '2.0 star rating') || (response[i].Rating === '1.0 star rating')) {
        stats.NumNeg += 1;
        reviews.Negative.push(response[i]);
      } else if ((response[i].Rating === 'FIVE') || (response[i].Rating === 'FOUR') || (response[i].Rating === 'positive') ||
      (response[i].Rating === '4.0 star rating') || (response[i].Rating === '5.0 star rating')) {
        stats.NumPos += 1;
        reviews.Positive.push(response[i]);
      } else {
        stats.NumNeutral += 1;
        reviews.Neutral.push(response[i]);
      }
    }
    res.json({ reviews, stats });
  }).catch((err) => {
    console.log(err);
  });
}

export function fetchLocationStats(req, res) {
  console.log('in fetchLocationStats', req.query.start);
  const startDate = req.query.start;
  const endDate = req.query.end;

  Review.find({ $and: [{ Date: { $gt: startDate } }, { Date: { $lte: endDate } }] }).then((response) => {
    console.log('fetchLocationStats response', response);
    const locationData = {};
    for (let i = 0; i < locationNames.length; i += 1) {
      locationData[locationNames[i]] = {
        NumNeg: 0, NumPos: 0, NumNeutral: 0, NumTotal: 0,
      };
    }
    console.log(locationData);
    for (let i = 0; i < response.length; i += 1) {
      if ((response[i].Rating === 'ONE') || (response[i].Rating === 'TWO') || (response[i].Rating === 'negative') ||
      (response[i].Rating === '2.0 star rating') || (response[i].Rating === '1.0 star rating')) {
        locationData[response[i].Location].NumNeg += 1;
      } else if ((response[i].Rating === 'FIVE') || (response[i].Rating === 'FOUR') || (response[i].Rating === 'positive') ||
      (response[i].Rating === '4.0 star rating') || (response[i].Rating === '5.0 star rating')) {
        locationData[response[i].Location].NumPos += 1;
      } else {
        locationData[response[i].Location].NumNeutral += 1;
      }
      locationData[response[i].Location].NumTotal += 1;
    }
    console.log(locationData);
    console.log(Object.keys(locationData).length);
    res.json({ locationData });
  }).catch((err) => {
    console.log(err);
  });
}
