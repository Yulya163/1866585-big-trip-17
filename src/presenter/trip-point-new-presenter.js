import {render, remove, RenderPosition} from '../framework/render';
import FormView from '../view/form-view';
import {isEscapePressed} from '../utils/common';
import {UserAction, UpdateType} from '../consts.js';

export default class TripPointNewPresenter {
  #tripPointsListContainer = null;
  #changeData = null;
  #tripPointEditComponent = null;
  #destroyCallback = null;

  #offers = null;
  #destinations = null;

  constructor(tripPointsListContainer, changeData) {
    this.#tripPointsListContainer = tripPointsListContainer;
    this.#changeData = changeData;
  }

  init = (callback, offers, destinations) => {
    this.#destroyCallback = callback;

    if (this.#tripPointEditComponent !== null) {
      return;
    }
    this.#offers = offers;
    this.#destinations = destinations;

    this.#tripPointEditComponent = new FormView(this.#offers, this.#destinations);
    this.#tripPointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#tripPointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#tripPointEditComponent, this.#tripPointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (this.#tripPointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#tripPointEditComponent);
    this.#tripPointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#tripPointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#tripPointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#tripPointEditComponent.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapePressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
