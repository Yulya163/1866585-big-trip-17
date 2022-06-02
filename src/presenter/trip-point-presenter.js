import {render, replace, remove} from '../framework/render';
import TripPointView from '../view/trip-point-view';
import FormView from '../view/form-view';
import {isEscapePressed} from '../utils/common';
import {UserAction, UpdateType} from '../consts.js';
import {isPointFuture, isPointPast, isPointСurrent} from '../utils/point.js';

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

    this.#tripPointComponent = new TripPointView(this.#point, this.#offers);
    this.#tripPointEditComponent = new FormView(this.#offers, this.#destinations, this.#point);

    this.#tripPointComponent.setEditClickHandler(this.#handleEditClick);
    this.#tripPointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#tripPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#tripPointEditComponent.setFormClickHandler(this.#handleFormClick);
    this.#tripPointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

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
      this.#tripPointEditComponent.reset(this.#point);
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
      this.#tripPointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
    this.#tripPointEditComponent.reset(this.#point);
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      isPointFuture(this.#point.dateFrom) !== isPointFuture(update.dateFrom) ||
      isPointPast(this.#point.dateTo) !== isPointPast(update.dateTo) ||
      isPointСurrent(this.#point.dateFrom, this.#point.dateTo) !== isPointСurrent(update.dateFrom, update.dateTo);

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceFormToCard();
  };

  #handleFormClick = () => {
    this.#replaceFormToCard();
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
