import {FilterType} from '../const';

export const generateFilter = () => Object.entries(FilterType).map(
  ([filterName]) => ({
    name: filterName,
  }),
);
