import helper from './helper';

const covid19ImpactEstimator = (data = {}) => {
  const {
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation },
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds
  } = data;

  const impactCI = helper.getImpactCurrentlyInfected(reportedCases);
  const severeCI = helper.getSevereImpactCurrentlyInfected(reportedCases);
  const impIBRT = helper.infectionFactor(periodType, timeToElapse) * impactCI;
  const sevIBRT = helper.infectionFactor(periodType, timeToElapse) * severeCI;
  const impactSevCBRT = helper.getWholeNumber(impIBRT * 0.15);
  const sevSevCBRT = helper.getWholeNumber(sevIBRT * 0.15);
  const iHospitalBedByReqTime = helper.getWholeNumber(totalHospitalBeds * 0.35 - impactSevCBRT);
  const sHospitalBedByReqTime = helper.getWholeNumber(totalHospitalBeds * 0.35 - sevSevCBRT);
  const impactCasesForICUBRT = helper.getWholeNumber(impIBRT * 0.05);
  const severeCasesForICUBRT = helper.getWholeNumber(sevIBRT * 0.05);
  const impactCFVBRT = helper.getWholeNumber(impIBRT * 0.02);
  const severeCFVBRT = helper.getWholeNumber(sevIBRT * 0.02);
  const days = helper.getDays(periodType, timeToElapse);
  const dIF = (avgDailyIncomePopulation * avgDailyIncomeInUSD);
  const impactDIF = helper.getWholeNumber((impIBRT * dIF) / days);
  const severeDIF = helper.getWholeNumber((sevIBRT * dIF) / days);

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
