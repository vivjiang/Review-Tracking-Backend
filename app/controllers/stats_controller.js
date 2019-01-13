import Location from '../models/Location';
import Cohort from '../models/Cohort';

function generateDateStrings() {
  const startDateStrings = [];
  const endDateStrings = [];
  let startDate = new Date('1/01/2018');
  // console.log('startDate', startDate.toString());
  const endDate = new Date('12/31/2018');
  const startMonth = startDate.getMonth();
  let m = 1;
  while (startDate <= endDate) {
    let startMonthString = `${startDate.getMonth() + 1}`;
    if (startMonthString.length <= 1) {
      startMonthString = `0${startDate.getMonth() + 1}`;
    } else {
      startMonthString = `${startDate.getMonth() + 1}`;
    }

    let endMonthString = `${startDate.getMonth() + 2}`;
    if (endMonthString.length <= 1) {
      endMonthString = `0${startDate.getMonth() + 2}`;
    } else {
      endMonthString = `${startDate.getMonth() + 2}`;
    }

    const startDateString = `${startDate.getFullYear()}-${startMonthString}-0${startDate.getDate()}`;
    const endDateString = `${startDate.getFullYear()}-${endMonthString}-0${startDate.getDate()}`;
    startDateStrings.push(startDateString);
    endDateStrings.push(endDateString);

    startDate = new Date(2018, (startMonth + m), 1);
    m += 1;
  }
  return ({ startDateStrings, endDateStrings });
}

function fetchStatsHelper(response) {
  const locationData = {};
  let l = 0;
  while (l < response.length) {
    const stats = response[l].Stats;
    const loc = response[l].Location;
    const filteredData = {};

    const { startDateStrings, endDateStrings } = generateDateStrings();
    let m = 0;
    while (m < startDateStrings.length) {
      const chartData = {
        NumNeg: 0, NumPos: 0, NumNeutral: 0, NumTotal: 0, CumulativePos: 0, CumulativeNeg: 0, CumulativeTotal: 0,
      };
      const start = startDateStrings[m];
      const end = endDateStrings[m];
      stats.filter((c) => {
        if ((c.Date >= start) && (c.Date < end)) {
          chartData.NumNeg += c.Data.NumNeg;
          chartData.NumPos += c.Data.NumPos;
          chartData.NumNeutral += c.Data.NumNeutral;
          chartData.NumTotal += c.Data.NumTotal;
          chartData.CumulativeNeg = c.Data.cumulativeNeg;
          chartData.CumulativePos = c.Data.cumulativePos;
          chartData.CumulativeTotal = c.Data.cumulativeTotal;
        }
        return chartData;
      });
      // console.log('chartData', chartData);
      filteredData[startDateStrings[m]] = chartData;
      m += 1;
    }

    // console.log(filteredData);
    locationData[loc] = filteredData;
    l += 1;
  }
  // console.log('helper locationData', locationData);
  return ({ locationData });
}

export function fetchChartDataCohort(req, res) {
  console.log('in stats controller fetch chart data cohort');
  const cohortName = req.query.cohortFilter;

  Cohort.find({ CohortName: cohortName }).then((response) => {
    console.log('cohort found', response);
    const locationFilter = response[0].Locations;
    console.log('cohort locations', locationFilter);

    Location.find({ Location: { $in: locationFilter } }).then((data) => {
      // console.log('cohort response', data);
      const { locationData } = fetchStatsHelper(data);
      const { startDateStrings } = generateDateStrings();
      // console.log('cohort data by location', locationData);
      const cohortData = {};
      const cData = {};
      let d = 0;
      while (d < startDateStrings.length) {
        const date = startDateStrings[d];
        console.log('on date', date);
        cData[date] = {
          NumNeg: 0, NumPos: 0, NumNeutral: 0, NumTotal: 0, CumulativePos: 0, CumulativeNeg: 0, CumulativeTotal: 0,
        };
        let l = 0;
        while (l < locationFilter.length) {
          const loc = locationFilter[l];
          console.log('on location', loc);
          const locData = locationData[loc];
          cData[date].NumNeg += locData[startDateStrings[d]].NumNeg;
          cData[date].NumPos += locData[startDateStrings[d]].NumPos;
          cData[date].NumNeutral += locData[startDateStrings[d]].NumNeutral;
          cData[date].NumTotal += locData[startDateStrings[d]].NumTotal;
          cData[date].CumulativePos += locData[startDateStrings[d]].CumulativePos;
          cData[date].CumulativeNeg += locData[startDateStrings[d]].CumulativeNeg;
          cData[date].CumulativeTotal += locData[startDateStrings[d]].CumulativeTotal;
          l += 1;
        }
        d += 1;
      }
      console.log('cohort data', cData);
      cohortData[cohortName] = cData;
      res.json({ cohortData });
    });
  }).catch((error) => {
    console.log(error);
  });
}

export function fetchChartDataLocation(req, res) {
  console.log('in stats controller fetch chart data');
  // console.log('in cumulative percent negative default');
  const locationFilter = req.query.locationFilterBy;
  console.log(locationFilter);
  Location.find({ Location: { $in: locationFilter } }).then((response) => {
    // console.log(response[0].Stats);
    const { locationData } = fetchStatsHelper(response);
    console.log('fetchChartData locationData', locationData);
    res.json({ locationData });
  }).catch((error) => {
    console.log(error);
  });
}
