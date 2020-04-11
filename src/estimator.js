const getImpactCurrentlyInfected = (inputData) => inputData * 10;
const getSevereImpactCurrentlyInfected = (inputData) => inputData * 50;
const infectionFactor = (periodType, number) => {
  let factor = 0;
  const periodTypeLower = periodType.toLowerCase();
  if (periodTypeLower === 'days') {
    factor = 2 ** Math.floor(number / 3);
  } else if (periodTypeLower === 'weeks') {
    factor = 2 ** Math.floor((number * 7) / 3);
  } else if (periodTypeLower === 'months') {
    factor = 2 ** Math.floor((number * 30) / 3);
  }
  return factor;
};

const covid19ImpactEstimator = (data = {}) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds
  } = data;
  const impactCI = getImpactCurrentlyInfected(reportedCases);
  const severeCI = getSevereImpactCurrentlyInfected(reportedCases);
  const impIBRT = infectionFactor(periodType, timeToElapse) * impactCI;
  const sevIBRT = infectionFactor(periodType, timeToElapse) * severeCI;
  const impactSevCBRT = Math.floor(impIBRT * 0.15);
  const sevSevCBRT = Math.floor(sevIBRT * 0.15);
  const iHospitalBedByReqTime = Math.floor((totalHospitalBeds * 0.35) - impactSevCBRT);
  const sHospitalBedByReqTime = Math.floor((totalHospitalBeds * 0.35) - sevSevCBRT);
  return {
    data: { data },
    impact: {
      currentlyInfected: impactCI,
      infectionsByRequestedTime: impIBRT,
      severeCasesByRequestedTime: impactSevCBRT,
      hospitalBedsByRequestedTime: iHospitalBedByReqTime
    },
    severeImpact: {
      currentlyInfected: severeCI,
      infectionsByRequestedTime: sevIBRT,
      severeCasesByRequestedTime: sevSevCBRT,
      hospitalBedsByRequestedTime: sHospitalBedByReqTime
    }
  };
};

export default covid19ImpactEstimator;
