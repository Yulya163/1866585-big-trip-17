import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isToday);

const humanizePointDueDate = (dueDate) => dayjs(dueDate).format('MMM D');

const humanizePointDueTime = (dueDate) => dayjs(dueDate).format('HH:mm');

const humanizePointDueDateAndTime = (dueDate) => dayjs(dueDate).format('DD/MM/YY HH:mm');

const humanizePointDurationTime = (startDate, endDate) => {
  const durationTime = dayjs(endDate).diff(startDate);
  const durationTimeInHour = dayjs(endDate).diff(startDate, 'hour');

  if (durationTimeInHour < 1) {
    return dayjs.duration(durationTime).format('mm[M]');
  }
  if (durationTimeInHour >= 1 && durationTimeInHour < 24) {
    return dayjs.duration(durationTime).format('HH[H] mm[M]');
  }
  if (durationTimeInHour >= 24) {
    return dayjs.duration(durationTime).format('DD[D] HH[H] mm[M]');
  }
  return '';
};

const isPointFuture = (startDate) => startDate && dayjs(startDate).isSameOrAfter(dayjs(), 'D');

const isPointPast = (endDate) => endDate && dayjs(endDate).isSameOrBefore(dayjs(), 'D') && !dayjs(endDate).isToday();

export {humanizePointDueDate, humanizePointDueTime, humanizePointDurationTime, humanizePointDueDateAndTime, isPointFuture, isPointPast};
