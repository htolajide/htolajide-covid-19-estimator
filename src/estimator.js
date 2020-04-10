const currentlyInfected = (inputData) => inputData * 10;

const covid19ImpactEstimator = (data = {}) => {
  const { reportedCases } = data;
  return {
    data: { data },
    impact: { currentlyInfected: currentlyInfected(reportedCases) },
    severeImpact: {}
  };
};

export default covid19ImpactEstimator;
