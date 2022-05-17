import {render, replace, remove} from '../framework/render';
import TripPointView from '../view/trip-point-view';
import FormView from '../view/form-view';
import {isEscapePressed} from '../utils/common';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class TripPointPresenter {
  #tripPointsListContainer = null;
  #changeData = null;
  #changeMode = null;

  #tripPointComponent = null;
  #tripPointEditComponent = null;

  #point = null;
  #offers = null;
  #destinations = null;
  #mode = Mode.DEFAULT;

  constructor(tripPointsListContainer, changeData, changeMode) {
    this.#tripPointsListContainer = tripPointsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point, offers, destinations) => {
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;

    const prevPointComponent = this.#tripPointComponent;
    const prevPointEditComponent = this.#tripPointEditComponent;

    this.#tripPointComponent = new TripPointView(point, offers);
    this.#tripPointEditComponent = new FormView(point, offers, destinations);

    this.#tripPointComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripPointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#tripPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#tripPointEditComponent.setFormClickHandler(this.#handleFormClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#tripPointComponent, this.#tripPointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#tripPointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);

  };

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToCard();
    }
  };

  #replaceCardToForm = () => {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToCard = () => {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapePressed(evt)) {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceFormToCard();
  };

  #handleFormClick = () => {
    this.#replaceFormToCard();
  };
}
