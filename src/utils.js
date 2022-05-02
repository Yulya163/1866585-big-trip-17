import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const humanizePointDueDate = (dueDate) => dayjs(dueDate).format('MMM D');

const humanizePointDueTime = (dueDate) => dayjs(dueDate).format('HH:mm');

const humanizePointDueDateAndTime = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');

const humanizePointDurationTime = (startDate, endDate) => {

  const duration = require('dayjs/plugin/duration')
  dayjs.extend(duration);

  let durationTime = dayjs(endDate).diff(startDate);
  let durationTimeInHour = dayjs(endDate).diff(startDate, 'hour');

  if (durationTimeInHour < 1) {
    return dayjs.duration(durationTime).format('mm[M]')
  }
  if (durationTimeInHour >= 1 && durationTime < 24) {
    dayjs.duration(durationTime).format('HH[H] mm[M]')
  }
  if (durationTimeInHour >= 24) {
    return dayjs.duration(durationTime).format('DD[D] HH[H] mm[M]')
  }
  return null;
}

export {getRandomInteger, humanizePointDueDate, humanizePointDueTime, humanizePointDurationTime, humanizePointDueDateAndTime};
