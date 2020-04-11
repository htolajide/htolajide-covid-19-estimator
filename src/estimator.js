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
  const impIBR = infectionFactor(periodType, timeToElapse) * impactCI;
  const sevIBR = infectionFactor(periodType, timeToElapse) * severeCI;
  const impactSevCBRT = infectionFactor(periodType, timeToElapse) * impactCI * Math.floor(15 / 100);
  const sevSevCBRT = infectionFactor(periodType, timeToElapse) * severeCI * Math.floor(15 / 100);
  const iHospitalBedByReqTime = ((totalHospitalBeds * (35 / 100)) - impactSevCBRT);
  const sHospitalBedByReqTime = ((totalHospitalBeds * Math.floor(35 / 100)) - sevSevCBRT);
  return {
    data: { data },
    impact: {
      currentlyInfected: impactCI,
      infectionsByRequestedTime: impIBR,
      severeCasesByRequestedTime: impactSevCBRT,
      hospitalBedsByRequestTime: iHospitalBedByReqTime
    },
    severeImpact: {
      currentlyInfected: severeCI,
      infectionsByRequestedTime: sevIBR,
      severeCasesByRequestedTime: sevSevCBRT,
      hospitalBedsByRequestTime: sHospitalBedByReqTime
    }
  };
};

export default covid19ImpactEstimator;
