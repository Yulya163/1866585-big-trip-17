import {getRandomInteger} from '../utils/common';
import {nanoid} from 'nanoid';

const generatePointType = () => {
  const pointType = [
    'taxi',
    'bus',
    'train',
    'ship',
    'drive',
    'flight',
    'check-in',
    'sightseeing',
    'restaurant'
  ];
  const randomIndex = getRandomInteger(0, pointType.length - 1);
  return pointType[randomIndex];
};

const getRandomFavoriteStatus = () => Boolean(getRandomInteger(0, 1));

const transformPoint = (point) => ({
  basePrice: point['base_price'],
  dateFrom: point['date_from'],
  dateTo: point['date_to'],
  destination: point['destination'],
  id: point['id'],
  isFavorite: point['is_favorite'],
  offers: point['offers'],
  type: point['type'],
});

const generateCity = () => {
  const cityName = [
    'Chamonix',
    'Geneva',
    'Amsterdam',
    'Helsinki'
  ];
  const randomIndex = getRandomInteger(0, cityName.length - 1);
  return cityName[randomIndex];
};

export const generatePoint = () => {
  const point = {
    'id': nanoid(),
    'base_price': getRandomInteger(5, 500),
    'date_from': `2022-05-${getRandomInteger(10, 17)}T0${getRandomInteger(1, 3)}:16:54.401Z`,
    'date_to': `2022-05-${getRandomInteger(17, 20)}T03:${getRandomInteger(17, 55)}:54.401Z`,
    'destination': generateCity(),
    'is_favorite': getRandomFavoriteStatus(),
    'offers': [1, 2],
    'type': generatePointType(),
  };
  return transformPoint(point);
};
