import {createElement} from '../render.js';
import {humanizePointDueDateAndTime} from '../utils.js';

const renderAvailableOffers = (allOffers, offersId) => {

  let availableOffers = [];
  let available = [];

  for (const offerId of offersId) {
    const offer = allOffers.filter(el => el.id === offerId);
    availableOffers.push(...offer);
  }

  for (const offer of availableOffers) {
    available += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage">
    <label class="event__offer-label" for="event-offer-luggage-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`
  }
  return available;
}

const createAvailableOffersTemplate = (allOffers, offersId) => (
  `${offersId && offersId !== []
  ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${renderAvailableOffers(allOffers, offersId)}
    </div>
  </section>`
  : null}`
)

const renderPictures = (destination) => {
  let photos = '';
  for (const photo of destination.pictures) {
    photos += `<img class="event__photo" src=${photo.src} alt=${photo.description}></img>`
  }
  return photos;
}

const createDestinationTemplate = (destination) => (
  `<section class="event__section  event__section--destination">
    ${destination.description && destination.description !== null ?
    `<h3 class="event__section-title  event__section-title--destination">Destination</h3>`
    : ""}
    ${destination.description !== null ?
    `<p class="event__destination-description">${destination.description}</p>`
    : ""}
    ${destination.pictures !== null ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${renderPictures(destination)}
      </div>
    </div>`:
    ""}
  </section>`
)

const createFormTemplate = (point = {}, allOffers = []) => {
  const {
    basePrice = null,
    dateFrom = null,
    dateTo = null,
    destination  = {},
    offers = [],
    type = "taxi",
  } = point;

  const offersTemplate = createAvailableOffersTemplate(allOffers, offers.offers);
  const destinationTemplate = createDestinationTemplate(destination);

  const dateStart = dateFrom !== null
      ? humanizePointDueDateAndTime(dateFrom)
      : '';
  const dateEnd = dateTo !== null
      ? humanizePointDueDateAndTime(dateTo)
      : '';

  return  (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value=${destination.name} list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          ${point ?
            `<button class="event__reset-btn" type="reset">Delete</button>` :
            `<button class="event__reset-btn" type="reset">Cancel</button>`
          }

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offers.offers ? `${offersTemplate}` : ''}
          ${destinationTemplate}
        </section>
      </form>
    </li>`
  )
};

export default class FormView {
  constructor(point, allOffers) {
    this.point = point;
    this.allOffers = allOffers;
  }
  getTemplate() {
    return createFormTemplate(this.point, this.allOffers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
