import {render, replace} from '../framework/render.js';
import SortingView from '../view/sorting-view.js';
import TripPointListView from '../view/trip-point-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import FormView from '../view/form-view.js';
import NoPointsView from '../view/no-points-view.js';
import {isEscapePressed} from '../utils/common.js';

export default class TripEventsPresenter {
  #tripContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #tripPointsListComponent = new TripPointListView();

  #tripPoints = [];
  #allOffers = [];
  #allDestinations = [];

  constructor(tripContainer, pointsModel, offersModel, destinationsModel,) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.init();
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#allOffers = [...this.#offersModel.offers];
    this.#allDestinations = [...this.#destinationsModel.destinations];

    this.#renderTripPointsList();
  }

  #renderTripPoint = (point, offers, destinations) => {
    const tripPointComponent = new TripPointView(point, offers);
    const tripPointEditComponent = new FormView(point, offers, destinations);

    const replaceCardToForm = () => {
      replace(tripPointEditComponent, tripPointComponent);
    };
    const replaceFormToCard = () => {
      replace(tripPointComponent, tripPointEditComponent);
    };
    const onEscKeyDown = (evt) => {
      if (isEscapePressed(evt)) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    tripPointComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    tripPointEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    tripPointEditComponent.setFormClickHandler(() => {
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(tripPointComponent, this.#tripPointsListComponent.element);
  };

  #renderTripPointsList = () => {
    if (this.#tripPoints.length === 0) {
      render(new NoPointsView(), this.#tripContainer);
      return;
    }
    render(new SortingView(), this.#tripContainer);
    render(this.#tripPointsListComponent, this.#tripContainer);

    this.#tripPoints.forEach((tripPoint) => {
      this.#renderTripPoint(tripPoint, this.#allOffers, this.#allDestinations);
    });
  };
}
