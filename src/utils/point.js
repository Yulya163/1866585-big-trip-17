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

const isPointСurrent = (startDate, endDate) => startDate && endDate && dayjs(startDate).isSameOrBefore(dayjs(), 'D') && !dayjs(startDate).isToday() && dayjs(endDate).isSameOrAfter(dayjs(), 'D');

const getWeightForStartDate = (dateA, dateB) => dateA - dateB;

const getWeightForTimeDown = (timeA, timeB) => timeB - timeA;

const getWeightForPriceDown = (priceA, priceB) => priceB - priceA;

const sortDayUp = (pointA, pointB) => getWeightForStartDate(dayjs(pointA.dateFrom), dayjs(pointB.dateFrom));

const sortTimeDown = (pointA, pointB) => {
  const durationTimePointA = dayjs(pointA.dateTo).diff(pointA.dateFrom);
  const durationTimePointB = dayjs(pointB.dateTo).diff(pointB.dateFrom);

  return getWeightForTimeDown(durationTimePointA, durationTimePointB);
};

const sortPriceDown = (pointA, pointB) => getWeightForPriceDown(pointA.basePrice, pointB.basePrice);

export {
  humanizePointDueDate,
  humanizePointDueTime,
  humanizePointDurationTime,
  humanizePointDueDateAndTime,
  isPointFuture,
  isPointPast,
  isPointСurrent,
  sortTimeDown,
  sortPriceDown,
  sortDayUp
};
