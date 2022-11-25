import * as dayjs from 'dayjs';

export const DAYS = ['SU', 'M', 'T', 'W', 'TH', 'F', 'SA'];

/**
 * Accumulate the number of minutes of each unit in {units}
 * up to {numDays} after today.
 * @param {*} units Units to accumulate
 * @param {dayjs.Dayjs} start Start date
 * @param {number} numDaysAfter Number of days after start
 * @return {number} Accumulated number of minutes.
 */
export function accumulateUnitMinutes(units, start, numDaysAfter = 0) {
  // let cutoff = new Date();
  // cutoff.setDate(start.getDate() + numDaysAfter + 1);
  // cutoff = dayjs(cutoff);

  const cutoff = start.add(numDaysAfter + 1, 'day');

  let total = 0;
  for (const unit of units) {
    if (unit.dueDate) {
      const dueDate = dayjs.unix(unit.dueDate);
      if (dueDate.isBefore(cutoff, 'day')) {
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

export function isOverdue(dueDate) {
  if (dueDate === null) {
    return false;
  }
  return dayjs.unix(dueDate).isBefore(dayjs(), 'day');
}
