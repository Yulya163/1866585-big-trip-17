import {render, replace, remove} from '../framework/render.js';
import TripPointView from '../view/trip-point-view.js';
import FormView from '../view/form-view.js';
import {isEscapePressed} from '../utils/common.js';

export default class TripPointPresenter {
  #tripPointsListContainer = null;

  #tripPointComponent = null;
  #tripPointEditComponent = null;

  #point = null;
  #offers = null;
  #destinations = null;

  constructor(tripPointsListContainer) {
    this.#tripPointsListContainer = tripPointsListContainer;
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

    this.#tripPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);

    this.#tripPointEditComponent.setFormClickHandler(this.#handleFormClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#tripPointComponent, this.#tripPointsListContainer);
      return;
    }

    if (this.#tripPointsListContainer.contains(prevPointComponent.element)) {
      replace(this.#tripPointComponent, prevPointComponent);
    }

    if (this.#tripPointsListContainer.contains(prevPointEditComponent.element)) {
      replace(this.#tripPointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);

  };

  destroy = () => {
    remove(this.#tripPointComponent);
    remove(this.#tripPointEditComponent);
  };

  #replaceCardToForm = () => {
    replace(this.#tripPointEditComponent, this.#tripPointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceFormToCard = () => {
    replace(this.#tripPointComponent, this.#tripPointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
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

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };

  #handleFormClick = () => {
    this.#replaceFormToCard();
  };
}
