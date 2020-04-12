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

const getDays = (periodType, number) => {
  let days = 0;
  const periodTypeLower = periodType.toLowerCase();
  if (periodTypeLower === 'days') {
    days = number;
  } else if (periodTypeLower === 'weeks') {
    days = number * 7;
  } else if (periodTypeLower === 'months') {
    days = number * 30;
  }
  return days;
};

const getWholeNumber = (number) => {
  if (number > 0) return Math.floor(number);
  return Math.ceil(number);
};

const covid19ImpactEstimator = (data = {}) => {
  const {
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation },
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
  const iHospitalBedByReqTime = getWholeNumber(totalHospitalBeds * 0.35 - impactSevCBRT);
  const sHospitalBedByReqTime = getWholeNumber(totalHospitalBeds * 0.35 - sevSevCBRT);
  const impactCasesForICUBRT = Math.floor(impactSevCBRT * 0.05);
  const severeCasesForICUBRT = Math.floor(sevSevCBRT * 0.05);
  const impactCFVBRT = Math.floor(impactSevCBRT * 0.02);
  const severeCFVBRT = Math.floor(sevSevCBRT * 0.05);
  const days = getDays(periodType, timeToElapse);
  const dIF = Math.floor(avgDailyIncomePopulation * avgDailyIncomeInUSD);
  const impactDIF = (impIBRT * dIF) / days;
  const severeDIF = (sevIBRT * dIF) / days;

  return {
    data: { data },
    impact: {
      currentlyInfected: impactCI,
      infectionsByRequestedTime: impIBRT,
      severeCasesByRequestedTime: impactSevCBRT,
      hospitalBedsByRequestedTime: iHospitalBedByReqTime,
      casesForICUByRequestedTime: impactCasesForICUBRT,
      casesForVentilatorsByRequestedTime: impactCFVBRT,
      dollarsInFlight: impactDIF
    },
    severeImpact: {
      currentlyInfected: severeCI,
      infectionsByRequestedTime: sevIBRT,
      severeCasesByRequestedTime: sevSevCBRT,
      hospitalBedsByRequestedTime: sHospitalBedByReqTime,
      casesForICUByRequestedTime: severeCasesForICUBRT,
      casesForVentilatorsByRequestedTime: severeCFVBRT,
      dollarsInFlight: severeDIF
    }
  };
};

export default covid19ImpactEstimator;
