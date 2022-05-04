import SortingView from '../view/sorting-view.js';
import TripPointListView from '../view/trip-point-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import FormView from '../view/form-view.js';
import {render} from '../render.js';

export default class TripEventsPresenter {
  #tripContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #tripPointListComponent = new TripPointListView();

  #tripPoints = [];
  #allOffers = [];
  #allDestinations = [];

  init = (tripContainer, pointsModel, offersModel, destinationsModel) => {
    this.#tripContainer = tripContainer;

    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#tripPoints = [...this.#pointsModel.points];
    this.#allOffers = [...this.#offersModel.offers];
    this.#allDestinations = [...this.#destinationsModel.destinations];

    render(new SortingView(), this.#tripContainer);
    render(this.#tripPointListComponent, this.#tripContainer);
    render(new FormView(this.#tripPoints[0], this.#allOffers, this.#allDestinations), this.#tripPointListComponent.element, 'afterbegin');

    for (let i = 1; i < this.#tripPoints.length; i++) {
      render(new TripPointView(this.#tripPoints[i], this.#allOffers), this.#tripPointListComponent.element);
    }
  };
}
