import {FilterType} from '../const';

export const generateFilter = () => Object.values(FilterType).map(
  (filterName) => ({
    name: filterName,
  }),
);
