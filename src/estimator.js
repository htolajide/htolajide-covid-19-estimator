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
  const { reportedCases, periodType, timeToElapse, totalHospitalBeds } = data;
  const impactCurrentlyInfected = getImpactCurrentlyInfected(reportedCases);
  const severeImpactCurrentlyInfected = getSevereImpactCurrentlyInfected(reportedCases);
  const impactInfecByReqTime = infectionFactor(periodType, timeToElapse) * impactCurrentlyInfected;
  const sevInfecByReq = infectionFactor(periodType, timeToElapse) * severeImpactCurrentlyInfected;
  const impactSevCasesByRequestedTime = impactInfecByReqTime * (15 / 100);
  const sevSevCasesByReqTime = sevInfecByReq * (15 / 100);
  const iHospitalBedsByReqTime = totalHospitalBeds * (35 / 100) - impactSevCasesByRequestedTime;
  const sHospitalBedsByReqTime = totalHospitalBeds * (35 / 100) - sevInfecByReq;
  return {
    data: { data },
    impact: {
      currentlyInfected: impactCurrentlyInfected,
      infectionsByRequestedTime: impactInfecByReqTime,
      severeCasesByrequestedTime: impactSevCasesByRequestedTime,
      hospitalBedsByRequestTime: iHospitalBedsByReqTime
    },
    severeImpact: {
      currentlyInfected: severeImpactCurrentlyInfected,
      infectionsByRequestedTime: sevInfecByReq,
      severeCasesByrequestedTime: sevSevCasesByReqTime,
      hospitalBedsByRequestTime: sHospitalBedsByReqTime
    }
  };
};

export default covid19ImpactEstimator;
