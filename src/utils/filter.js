import {FilterType} from '../consts';

export const generateFilter = () => Object.values(FilterType).map(
  (filterName) => ({
    name: filterName,
  }),
);
