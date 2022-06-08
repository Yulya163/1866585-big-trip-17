import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDueDateAndTime} from '../utils/point';
import {PointType} from '../consts.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: '',
  dateFrom: null,
  dateTo: null,
  destination: {
    description: 'Moscow, full of of cozy canteens where you can try the best coffee in the Middle East.',
    name: 'Moscow',
    pictures: [
      {src: 'http://picsum.photos/300/200?r=0.19634950837018472', description: 'Moscow street market'},
      {src: 'http://picsum.photos/300/200?r=0.5720856992236947', description: 'Moscow central station'},
      {src: 'http://picsum.photos/300/200?r=0.034177739722138556', description: 'Moscow central station'},
      {src: 'http://picsum.photos/300/200?r=0.6777563536735964', description: 'Moscow biggest supermarket'},
      {src: 'http://picsum.photos/300/200?r=0.6006624166028778', description: 'Moscow parliament building'},
    ]
  },
  offers: [],
  type: 'flight',
  isFavorite: false,
  isStatusCreate: true,
};

const renderPointTypes = (types, checkedType) => Object.values(types).map((type) => {
  const checked = type === checkedType ? 'checked' : '';

  return `<div class='event__type-item'>
    <input id='event-type-${type}-1' class='event__type-input  visually-hidden' type='radio' name='event-type' value=${type} ${checked}>
    <label class='event__type-label  event__type-label--${type}' for='event-type-${type}-1'>${type.charAt(0).toUpperCase() + type.slice(1)}</label>
  </div>`;
}).join('');

const createPointTypesTemplate = (checkedType, isDisabled) => (
  `<div class='event__type-wrapper'>
    <label class='event__type  event__type-btn' for='event-type-toggle-1'>
      <span class='visually-hidden'>Choose event type</span>
      <img class='event__type-icon' width='17' height='17' src='img/icons/${checkedType}.png' alt='Event type icon'>
    </label>
    <input class='event__type-toggle  visually-hidden' id='event-type-toggle-1' type='checkbox' ${isDisabled ? 'disabled' : ''}>
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

const createAvailableDestinationsTemplate = (type, destination, allDestinations, isDisabled) => (
  `<div class='event__field-group  event__field-group--destination'>
    <label class='event__label  event__type-output' for='event-destination-1'>
      ${type}
    </label>
    <input class='event__input  event__input--destination' id='event-destination-1' type='text' name='event-destination' list='destination-list-1' value=${he.encode(destination)} ${isDisabled ? 'disabled' : ''}>
    <datalist id='destination-list-1'>
      ${renderAvailableDestinations(allDestinations)}
    </datalist>
  </div>`
);

const renderAvailableOffers = (checkedType, allOffers, checkedOffers, isDisabled) => {
  const pointTypeOffer = allOffers.find((offer) => offer.type === checkedType);

  return pointTypeOffer.offers.map((offer) => {
    const checked = checkedOffers.includes(offer.id) ? 'checked' : '';

    return `<div class='event__offer-selector'>
      <input class='event__offer-checkbox  visually-hidden' id='event-offer-luggage-${offer.id}' type='checkbox' name='event-offer-luggage' data-offer-id=${offer.id} ${checked} ${isDisabled ? 'disabled' : ''}>
      <label class='event__offer-label' for='event-offer-luggage-${offer.id}'>
        <span class='event__offer-title'>${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class='event__offer-price'>${offer.price}</span>
      </label>
    </div>`;
  }).join('');
};

const createAvailableOffersTemplate = (checkedType, allOffers, checkedOffers, isDisabled) => {
  const pointTypeOffer = allOffers.find((offer) => offer.type === checkedType);

  return pointTypeOffer && pointTypeOffer.offers.length ?
    `<section class='event__section  event__section--offers'>
      <h3 class='event__section-title  event__section-title--offers'>Offers</h3>
      <div class='event__available-offers'>
        ${renderAvailableOffers(checkedType, allOffers, checkedOffers, isDisabled)}
      </div>
    </section>` : '';
};

const renderPhotos = (allDestinations, checkedDestination) => {
  const pointCityDestination = allDestinations.find((destination) => destination.name === checkedDestination);

  return pointCityDestination.pictures.map((picture) => `<img class='event__photo' src=${picture.src} alt=${picture.description}>`).join('');
};

const createPhotosTemplate = (allDestinations, checkedDestination) => {
  const pointCityDestination = allDestinations.find((destination) => destination.name === checkedDestination);

  return pointCityDestination.pictures.length ?
    `<div class='event__photos-container'>
      <div class='event__photos-tape'>
        ${renderPhotos(allDestinations, checkedDestination)}
      </div>
    </div>` : '';
};

const createDestinationTemplate = (allDestinations, checkedDestination) => {
  const pointCityDestination = allDestinations.find((destination) => destination.name === checkedDestination);

  return pointCityDestination && pointCityDestination.description !== '' || pointCityDestination && pointCityDestination.pictures.length !== 0 ?
    `<section class='event__section  event__section--destination'>
      <h3 class='event__section-title  event__section-title--destination'>Destination</h3>
      <p class='event__destination-description'>${pointCityDestination.description}</p>
      ${createPhotosTemplate(allDestinations, checkedDestination)}
    </section>` :
    '';
};

const createFormTemplate = (data = {}, allOffers, allDestinations) => {
  const {
    dateFrom,
    dateTo,
    isStatusCreate,
    checkedType,
    checkedDestination,
    checkedOffers,
    newPrice,
    isDisabled,
    isSaving,
    isDeleting,
  } = data;

  const pointTypesTemplate = createPointTypesTemplate(checkedType, isDisabled);
  const availableDestinationsTemplate = createAvailableDestinationsTemplate(checkedType, checkedDestination, allDestinations, isDisabled);
  const offersTemplate = createAvailableOffersTemplate(checkedType, allOffers, checkedOffers, isDisabled);
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
            <input class='event__input  event__input--time' id='event-start-time-1' type='text' name='event-start-time' value='${dateStart}' ${isDisabled ? 'disabled' : ''}>
            &mdash;
            <label class='visually-hidden' for='event-end-time-1'>To</label>
            <input class='event__input  event__input--time' id='event-end-time-1' type='text' name='event-end-time' value='${dateEnd}' ${isDisabled ? 'disabled' : ''}>
          </div>

          <div class='event__field-group  event__field-group--price'>
            <label class='event__label' for='event-price-1'>
              <span class='visually-hidden'>Price</span>
              &euro;
            </label>
            <input class='event__input  event__input--price' id='event-price-1' type='text' name='event-price' value='${newPrice}' ${isDisabled ? 'disabled' : ''}>
          </div>

          <button class='event__save-btn  btn  btn--blue' type='submit' ${isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          <button class='event__reset-btn' type='reset' ${isDisabled ? 'disabled' : ''}>
            ${isStatusCreate ? 'Cancel' : `${isDeleting ? 'Deleting...' : 'Delete'}`}
          </button>
          ${!isStatusCreate ? `<button class='event__rollup-btn' type='button'>
            <span class='visually-hidden'>Open event</span>
          </button>` : ''}
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

  constructor(allOffers, allDestinations, point = BLANK_POINT) {
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
    this.setDeleteClickHandler(this._callback.deleteClick);
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
    const checkedDestination = this.#allDestinations.find((destination) => destination.name === evt.target.value);
    if (this.#allDestinations.some((destination) => destination.name === evt.target.value)) {
      this.updateElement({
        checkedDestination: evt.target.value,
        checkedDestinationDescription: checkedDestination.description,
        checkedDestinationPictures: checkedDestination.pictures,
      });
    }
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

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  setFormClickHandler = (callback) => {
    this._callback.formClick = callback;
    const rollupBtn = this.element.querySelector('.event__rollup-btn');
    if (rollupBtn) {
      rollupBtn.addEventListener('click', this.#formClickHandler);
    }
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

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(FormView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({...point,
    checkedType: point.type,
    checkedDestination: point.destination.name,
    checkedDestinationDescription: point.destination.description,
    checkedDestinationPictures: point.destination.pictures,
    checkedOffers: point.offers,
    newPrice: point.basePrice,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    if (point.checkedType !== point.type) {
      point.type = point.checkedType;
    }
    if (point.checkedDestination !== point.destination.name) {
      point.destination.name = point.checkedDestination;
      point.destination.description = point.checkedDestinationDescription;
      point.destination.pictures = point.checkedDestinationPictures;
    }
    point.offers = point.checkedOffers;
    point.basePrice = point.newPrice;

    delete point.checkedType;
    delete point.checkedDestination;
    delete point.checkedDestinationDescription;
    delete point.checkedDestinationPictures;
    delete point.checkedOffers;
    delete point.newPrice;
    if (point.isStatusCreate) {
      delete point.isStatusCreate;
    }
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

}
