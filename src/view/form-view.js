import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDueDateAndTime} from '../utils/point';
import {PointType} from '../consts.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: null,
  dateFrom: null,
  dateTo: null,
  destination: 'Chamonix',
  type: 'taxi',
};

const renderPointTypes = (types, checkedType) => Object.values(types).map((type) => {
  const checked = type === checkedType ? 'checked' : '';

  return `<div class='event__type-item'>
    <input id='event-type-${type}-1' class='event__type-input  visually-hidden' type='radio' name='event-type' value=${type} ${checked}>
    <label class='event__type-label  event__type-label--${type}' for='event-type-${type}-1'>${type.charAt(0).toUpperCase() + type.slice(1)}</label>
  </div>`;
}).join('');

const createPointTypesTemplate = (checkedType) => (
  `<div class='event__type-wrapper'>
    <label class='event__type  event__type-btn' for='event-type-toggle-1'>
      <span class='visually-hidden'>Choose event type</span>
      <img class='event__type-icon' width='17' height='17' src='img/icons/${checkedType}.png' alt='Event type icon'>
    </label>
    <input class='event__type-toggle  visually-hidden' id='event-type-toggle-1' type='checkbox'>
    <div class='event__type-list'>
      <fieldset class='event__type-group'>
        <legend class='visually-hidden'>Event type</legend>
        ${renderPointTypes(PointType, checkedType)}
      </fieldset>
    </div>
  </div>`
);

const renderAvailableDestinations = (allDestinations) => allDestinations.map((destination) => (
  `<option value=${destination.name}></option>`
)).join('');

const createAvailableDestinationsTemplate = (type, destination, allDestinations) => (
  `<div class='event__field-group  event__field-group--destination'>
    <label class='event__label  event__type-output' for='event-destination-1'>
      ${type}
    </label>
    <input class='event__input  event__input--destination' id='event-destination-1' type='text' name='event-destination' value=${destination} list='destination-list-1'>
    <datalist id='destination-list-1'>
      ${renderAvailableDestinations(allDestinations)}
    </datalist>
  </div>`
);

const renderAvailableOffers = (checkedType, allOffers, checkedOffers) => {
  const pointTypeOffer = allOffers.find((offer) => offer.type === checkedType);

  return pointTypeOffer.offers.map((offer) => {
    const checked = checkedOffers.includes(offer.id) ? 'checked' : '';

    return `<div class='event__offer-selector'>
      <input class='event__offer-checkbox  visually-hidden' id='event-offer-luggage-${offer.id}' type='checkbox' name='event-offer-luggage' data-offer-id=${offer.id} ${checked}>
      <label class='event__offer-label' for='event-offer-luggage-${offer.id}'>
        <span class='event__offer-title'>${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class='event__offer-price'>${offer.price}</span>
      </label>
    </div>`;
  }).join('');
};

const createAvailableOffersTemplate = (checkedType, allOffers, checkedOffers) => {
  const pointTypeOffer = allOffers.find((offer) => offer.type === checkedType);

  return pointTypeOffer.offers.length ?
    `<section class='event__section  event__section--offers'>
      <h3 class='event__section-title  event__section-title--offers'>Offers</h3>
      <div class='event__available-offers'>
        ${renderAvailableOffers(checkedType, allOffers, checkedOffers)}
      </div>
    </section>` : '';
};

const renderPhotos = (allDestinations, checkedDestination) => {
  const pointCityDestination = allDestinations.find((destination) => destination.name === checkedDestination);

  return pointCityDestination.pictures.map((picture) => `<img class="event__photo" src=${picture.src} alt=${picture.description}>`).join('');
};

const createDestinationTemplate = (allDestinations, checkedDestination) => {
  const pointCityDestination = allDestinations.find((destination) => destination.name === checkedDestination);

  return pointCityDestination && pointCityDestination.description !== '' ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${pointCityDestination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${renderPhotos(allDestinations, checkedDestination)}
        </div>
      </div>
    </section>` :
    '';
};

const createFormTemplate = (data, allOffers, allDestinations) => {
  const {dateFrom, dateTo, checkedType, checkedDestination, checkedOffers, newPrice} = data;

  const pointTypesTemplate = createPointTypesTemplate(checkedType);
  const availableDestinationsTemplate = createAvailableDestinationsTemplate(checkedType, checkedDestination, allDestinations);
  const offersTemplate = createAvailableOffersTemplate(checkedType, allOffers, checkedOffers);
  const destinationTemplate = createDestinationTemplate(allDestinations, checkedDestination);

  const dateStart = dateFrom !== null
    ? humanizePointDueDateAndTime(dateFrom)
    : '';
  const dateEnd = dateTo !== null
    ? humanizePointDueDateAndTime(dateTo)
    : '';

  return  (
    `<li class='trip-events__item'>
      <form class='event event--edit' action='#' method='post'>
        <header class='event__header'>

          ${pointTypesTemplate}
          ${availableDestinationsTemplate}

          <div class='event__field-group  event__field-group--time'>
            <label class='visually-hidden' for='event-start-time-1'>From</label>
            <input class='event__input  event__input--time' id='event-start-time-1' type='text' name='event-start-time' value='${dateStart}'>
            &mdash;
            <label class='visually-hidden' for='event-end-time-1'>To</label>
            <input class='event__input  event__input--time' id='event-end-time-1' type='text' name='event-end-time' value='${dateEnd}'>
          </div>

          <div class='event__field-group  event__field-group--price'>
            <label class='event__label' for='event-price-1'>
              <span class='visually-hidden'>Price</span>
              &euro;
            </label>
            <input class='event__input  event__input--price' id='event-price-1' type='text' name='event-price' value='${newPrice}'>
          </div>

          <button class='event__save-btn  btn  btn--blue' type='submit'>Save</button>
          <button class="event__reset-btn" type="reset">${data ? 'Delete' : 'Cancel'}</button>
          <button class='event__rollup-btn' type='button'>
            <span class='visually-hidden'>Open event</span>
          </button>
        </header>
        <section class='event__details'>
          ${offersTemplate}
          ${destinationTemplate}
        </section>
      </form>
    </li>`
  );
};

export default class FormView extends AbstractStatefulView {
  #allOffers = null;
  #allDestinations = null;

  #datepicker = null;

  constructor(point = BLANK_POINT, allOffers, allDestinations) {
    super();
    this._state = FormView.parsePointToState(point);

    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;

    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  get template() {
    return createFormTemplate(this._state, this.#allOffers, this.#allDestinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  reset = (point) => {
    this.updateElement(
      FormView.parsePointToState(point),
    );
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormClickHandler(this._callback.formClick);
  };

  #pointTypeClickHandler = (evt) => {
    if (!evt.target.classList.contains('event__type-label')) {
      return;
    }
    evt.preventDefault();
    this.updateElement({
      checkedType: evt.target.parentNode.querySelector('.event__type-input').value,
      checkedOffers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      checkedDestination: evt.target.value,
    });
  };

  #offersToggleHandler = (evt) => {
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const оffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox'))
      .filter((el) => el.checked)
      .map((el) => Number(el.dataset.offerId));

    this._setState({
      checkedOffers: оffers,
    });
  };

  #basePriceInputHandler = (evt) => {
    evt.preventDefault();
    const reg = /^(?:[1-9]\d*|\d)$/;
    this._setState({
      newPrice: reg.test(evt.target.value) ? evt.target.value : '',
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setFormClickHandler = (callback) => {
    this._callback.formClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formClickHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(FormView.parseStateToPoint(this._state));
  };

  #formClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.formClick();
  };

  #setDateFromPicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #setDateToPicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list')
      .addEventListener('click', this.#pointTypeClickHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('click', this.#offersToggleHandler);
    }
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#basePriceInputHandler);
  };

  static parsePointToState = (point) => ({...point,
    checkedType: point.type,
    checkedDestination: point.destination,
    checkedOffers: point.offers,
    newPrice: point.basePrice,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    if (point.checkedType !== point.type) {
      point.type = point.checkedType;
    }
    if (point.checkedDestination !== point.destination) {
      point.destination = point.checkedDestination;
    }
    point.offers = point.checkedOffers;
    point.basePrice = point.newPrice;

    delete point.checkedType;
    delete point.checkedDestination;
    delete point.checkedOffers;
    delete point.newPrice;

    return point;
  };

}
