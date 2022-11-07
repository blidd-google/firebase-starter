import * as dayjs from 'dayjs';

export function accumulateUnitMinutes(units, numDays) {
  const today = new Date();
  let cutoff = new Date();
  cutoff.setDate(today.getDate() + numDays);
  cutoff = dayjs(cutoff);

  let total = 0;
  for (const unit of units) {
    if (unit.dueDate) {
      const dueDate = dayjs.unix(unit.dueDate);
      if (dueDate.isBefore(cutoff)) {
        const est = unit.timeEst ? unit.timeEst : 0;
        total += est;
      }
    }
  }
  return total;
}

export function formatTimeEstimate(minutes) {
  let numMinutes = minutes;
  let numHours = 0;
  while (numMinutes >= 60) {
    numHours += 1;
    numMinutes -= 60;
  }
  return `${numHours} hours and ${numMinutes} minutes`;
}
