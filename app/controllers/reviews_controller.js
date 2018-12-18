import Review from '../models/Review';

export function fetchAllReviews(req, res) {
  // console.log('in fetchAllReviews');
  Review.find({}).then((response) => {
    // console.log('fetchAllReviews');
    const reviews = {};
    for (let i = 0; i < response.length; i += 1) {
      if (response[i].Date.getFullYear() >= 2017) {
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
      if (response[i].Location === 'Midland' && (response[i].Date.getFullYear() >= 2017)) {
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
    // const dates = Object.keys(cumulativePercent);
    // dates.sort((a, b) => {
    //   return new Date(a) - new Date(b);
    // });
    //
    // cumulativePercent[dates[0]].CumulativeNumPos = cumulativePercent[dates[0]].NumPos;
    // cumulativePercent[dates[0]].CumulativeNumNeg = cumulativePercent[dates[0]].NumNeg;
    // cumulativePercent[dates[0]].CumulativeTotal = cumulativePercent[dates[0]].NumTotal;
    // for (let i = 1; i < dates.length; i += 1) {
    //   cumulativePercent[dates[i]].CumulativeNumPos = cumulativePercent[dates[i]].NumPos;
    //   cumulativePercent[dates[i]].CumulativeNumPos += cumulativePercent[dates[i - 1]].CumulativeNumPos;
    //   cumulativePercent[dates[i]].CumulativeNumNeg = cumulativePercent[dates[i]].NumNeg;
    //   cumulativePercent[dates[i]].CumulativeNumNeg += cumulativePercent[dates[i - 1]].CumulativeNumNeg;
    //   cumulativePercent[dates[i]].CumulativeTotal = cumulativePercent[dates[i]].NumTotal;
    //   cumulativePercent[dates[i]].CumulativeTotal += cumulativePercent[dates[i - 1]].CumulativeTotal;
    //   cumulativePercent[dates[i]].CumulativePercentPos = (cumulativePercent[dates[i]].CumulativeNumPos / cumulativePercent[dates[i]].CumulativeTotal);
    //   cumulativePercent[dates[i]].CumulativePercentNeg = (cumulativePercent[dates[i]].CumulativeNumNeg / cumulativePercent[dates[i]].CumulativeTotal);
    // }

    // console.log(cumulativePercent);
    res.json(cumulativePercent);
  }).catch((error) => {
    console.log(error);
  });
}

export function fetchSomeReviews(req, res) {
  console.log('in fetchSomeReviews');
}
