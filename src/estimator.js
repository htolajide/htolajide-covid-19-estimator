const impactCurrentlyInfected = (inputData) => inputData * 10;
const severeImpactCurrentlyInfected = (inputData) => inputData * 50;

const covid19ImpactEstimator = (data = {}) => {
  const { reportedCases } = data;
  return {
    data: { data },
    impact: { currentlyInfected: impactCurrentlyInfected(reportedCases),
     },
    severeImpact: { currentlyInfected: severeImpactCurrentlyInfected(reportedCases),
     } 
  };
};

export default covid19ImpactEstimator;
