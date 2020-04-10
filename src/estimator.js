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
  const impactCurrentlyInfected = getImpactCurrentlyInfected(reportedCases);
  const severeImpactCurrentlyInfected = getSevereImpactCurrentlyInfected(reportedCases);
  const impactInfecByReqTime = infectionFactor(periodType, timeToElapse) * impactCurrentlyInfected;
  const sevInfecByReq = infectionFactor(periodType, timeToElapse) * severeImpactCurrentlyInfected;
  const impactSevCasesByRequestedTime = impactInfecByReqTime * Math.floor(15 / 100);
  const sevSevCasesByReqTime = sevInfecByReq * Math.floor(15 / 100);
  const iHospitalBedByReqTime = ((totalHospitalBeds * (35 / 100)) - impactSevCasesByRequestedTime);
  const sHospitalBedByReqTime = ((totalHospitalBeds * Math.floor(35 / 100)) - sevSevCasesByReqTime);
  return {
    data: { data },
    impact: {
      currentlyInfected: impactCurrentlyInfected,
      infectionsByRequestedTime: impactInfecByReqTime,
      severeCasesByRequestedTime: impactSevCasesByRequestedTime,
      hospitalBedsByRequestTime: iHospitalBedByReqTime
    },
    severeImpact: {
      currentlyInfected: severeImpactCurrentlyInfected,
      infectionsByRequestedTime: sevInfecByReq,
      severeCasesByRequestedTime: sevSevCasesByReqTime,
      hospitalBedsByRequestTime: sHospitalBedByReqTime
    }
  };
};

export default covid19ImpactEstimator;
