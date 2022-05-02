import {getRandomInteger} from '../utils.js';
import {generateOffers} from '../mock/offers.js';

const generatePointType = () => {
  const pointType = [
    "taxi",
    "bus",
    "train",
    "ship",
    "drive",
    "flight",
    "check-in",
    "sightseeing",
    "restaurant"
  ];
  const randomIndex = getRandomInteger(0, pointType.length - 1);
  return pointType[randomIndex];
};

const generateCity = () => {
  const cityName = [
    "Chamonix",
    "Geneva",
    "Amsterdam",
    "Prague"
  ];
  const randomIndex = getRandomInteger(0, cityName.length - 1);
  return cityName[randomIndex];
};

const generateDescription = () => {

  const description = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget",
    "Fusce tristique felis at fermentum pharetra",
    "Aliquam id orci ut lectus varius viverra",
    "Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante",
    "Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum",
    "Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui",
    "Sed sed nisi sed augue convallis suscipit in sed felis",
    "Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus",
    "Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing"
  ]
  const randomIndex = getRandomInteger(0, description.length - 1);
  return description[randomIndex];
}

const getRandomFavoriteStatus = () => Boolean(getRandomInteger(0, 1));

const generateDestination = (isEmpty) => {
  const destination = {
    "description": isEmpty ? null : Array.from({length: getRandomInteger(1, 5)}, generateDescription).join("."),
    "name": generateCity(),
    "pictures": isEmpty ? null : [
      {
        "src": `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`,
        "description": Array.from({length: getRandomInteger(1, 5)}, generateDescription).join("."),
      },
      {
        "src": `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`,
        "description": Array.from({length: getRandomInteger(1, 5)}, generateDescription).join("."),
      },
      {
        "src": `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`,
        "description": Array.from({length: getRandomInteger(1, 5)}, generateDescription).join("."),
      },
      {
        "src": `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`,
        "description": Array.from({length: getRandomInteger(1, 5)}, generateDescription).join("."),
      },
      {
        "src": `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`,
        "description": Array.from({length: getRandomInteger(1, 5)}, generateDescription).join("."),
      },
      {
        "src": `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`,
        "description": Array.from({length: getRandomInteger(1, 5)}, generateDescription).join("."),
      },
    ]
  };
  return destination;

};

const transformPoint = (point) => ({
  basePrice: point["base_price"],
  dateFrom: point["date_from"],
  dateTo: point["date_to"],
  destination: point["destination"],
  id: point["id"],
  isFavorite: point["is_favorite"],
  offers: point["offers"],
  type: point["type"],
});

export const generatePoint = () => {
  const type = generatePointType();
  const point = {
    "base_price": getRandomInteger(5, 500),
    "date_from": `2019-07-${getRandomInteger(10, 11)}T22:${getRandomInteger(10, 59)}:56.845Z`,
    "date_to": `2019-07-${getRandomInteger(13, 14)}T11:${getRandomInteger(10, 59)}:13.375Z`,
    "destination": generateDestination(Boolean(getRandomInteger(0, 1))),
    "id": "0",
    "is_favorite": getRandomFavoriteStatus(),
    "offers": generateOffers(type),
    "type": type,
  };
  return transformPoint(point);
}
