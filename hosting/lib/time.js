import * as dayjs from 'dayjs';

export const DAYS = ['SU', 'M', 'T', 'W', 'TH', 'F', 'SA'];

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

export function computeStreak(doneDates) {
  let streak;
  const dates = doneDates.map((epoch) => dayjs.unix(epoch)).reverse();
  const today = dayjs();
  const yesterday = dayjs().subtract(1, 'day');

  if (dates.length === 0) {
    return 0;
  }

  let currDate;
  if (dates[0].isSame(today, 'day')) {
    currDate = today;
    streak = 1;
  } else if (dates[0].isSame(yesterday, 'day')) {
    currDate = yesterday;
    streak = 1;
  } else {
    return 0;
  }

  for (const date of dates.slice(1)) {
    currDate = currDate.subtract(1, 'day');
    if (date.isSame(currDate, 'day')) {
      streak += 1;
    } else {
      return streak;
    }
  }

  return streak;
}

// currDate: today -1
// today -1, today -2, today -3
// 1
