import {FilterType} from '../consts';
import {isPointFuture, isPointPast, isPointСurrent} from './point';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom) || isPointСurrent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point.dateTo) || isPointСurrent(point.dateFrom, point.dateTo)),
};

export {filter};
