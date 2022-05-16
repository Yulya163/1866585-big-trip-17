import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDueTime, humanizePointDueDate, humanizePointDurationTime} from '../utils/point.js';

const renderSelectedOffers = (point, offers) => {
  const pointTypeOffer = offers.find((offer) => offer.type === point.type);

  return pointTypeOffer.offers.map((offer) => point.offers.includes(offer.id) ?
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      +€&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>` :  '').join('');
};

const createSelectedOffersTemplate = (point, offers) => `<ul class="event__selected-offers">${renderSelectedOffers(point, offers)}</ul>`;

const createTripItemTemplate = (point, allOffers = []) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    isFavorite = false,
    type
  } = point;

  const dateStart = dateFrom !== null
    ? humanizePointDueTime(dateFrom)
    : '';
  const dateEnd = dateTo !== null
    ? humanizePointDueTime(dateTo)
    : '';
  const date = dateFrom !== null
    ? humanizePointDueDate(dateFrom)
    : '';
  const duration = dateFrom && dateTo !== null
    ? humanizePointDurationTime(dateFrom, dateTo)
    : '';

  const favoriteClassName = isFavorite
    ? 'event__favorite-btn--active'
    : '';
  const selectedOffersTemplate = createSelectedOffersTemplate(point, allOffers);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="2019-03-18">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${dateStart}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${dateEnd}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${selectedOffersTemplate}
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class TripPointView extends AbstractView {
  constructor (point, allOffers) {
    super();
    this.point = point;
    this.allOffers = allOffers;
  }

  get template() {
    return createTripItemTemplate(this.point, this.allOffers);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
