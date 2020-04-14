export default {
  getImpactCurrentlyInfected: (inputData) => inputData * 10,

  getSevereImpactCurrentlyInfected: (inputData) => inputData * 50,

  infectionFactor: (periodType, number) => {
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
  },

  getDays: (periodType, number) => {
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
  },

  getWholeNumber: (number) => {
    if (number < 0) return Math.ceil(number);
    return Math.floor(number);
  }
};
