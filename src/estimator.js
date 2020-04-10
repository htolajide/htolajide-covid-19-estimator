const getImpactCurrentlyInfected = (inputData) => inputData * 10;
const getSevereImpactCurrentlyInfected = (inputData) => inputData * 50;
const infectionFactor = (periodType, number) => {
  let factor = 0;
  const periodTypeLower = periodType.toLower();
  if (periodTypeLower === 'days') {
    factor = 2 ** (number / 3);
  } else if (periodTypeLower === 'weeks') {
    factor = 2 ** (number / 21);
  } else if (periodTypeLower === 'months') {
    factor = 2 ** (number / 90);
  }
  return factor;
};

const covid19ImpactEstimator = (data = {}) => {
  const { reportedCases, periodType, timeToElapse } = data;
  const impactCurrentlyInfected = getImpactCurrentlyInfected(reportedCases);
  const severeImpactCurrentlyInfected = getSevereImpactCurrentlyInfected(reportedCases);
  const impactInfecByReqTime = infectionFactor(periodType, timeToElapse) * impactCurrentlyInfected;
  const sevInfecByReq = infectionFactor(periodType, timeToElapse) * severeImpactCurrentlyInfected;
  return {
    data: { data },
    impact: {
      currentlyInfected: impactCurrentlyInfected,
      infectionsByRequestedTime: impactInfecByReqTime
    },
    severeImpact: {
      currentlyInfected: severeImpactCurrentlyInfected,
      infectionsByRequestedTime: sevInfecByReq
    }
  };
};

export default covid19ImpactEstimator;
