import dayjs from 'dayjs';

export function statusFilterFactory(status) {
  return (unit) => unit.status === status;
}

export function typeFilterFactory(type) {
  return (unit) => unit.type === type;
}

export function timeFilterFactory({ start, end }) {
  return (unit) => {
    if (!unit.dueDate) {
      return false;
    }
    const dueDate = dayjs.unix(unit.dueDate);
    if (!!start && dueDate.isBefore(start)) {
      return false;
    }
    if (!!end && dueDate.isAfter(end)) {
      return false;
    }
    return true;
  };
}

export function topicFilterFactory(topicId) {
  return (unit) => unit.topicId === topicId;
}

export function applyFiltersToUnits(units, filters) {
  let unitsFiltered = Object.values(units);
  for (const f of filters) {
    unitsFiltered = unitsFiltered.filter(f);
  }
  return unitsFiltered;
}
