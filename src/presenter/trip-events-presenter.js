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

    for (let i = 0; i < this.#tripPoints.length; i++) {
      this.#renderTripPoint(this.#tripPoints[i], this.#allOffers, this.#allDestinations);
    }
  };

  #renderTripPoint = (point, offers, destinations) => {
    const tripPointComponent = new TripPointView(point, offers);
    const tripPointEditComponent = new FormView(point, offers, destinations);

    console.log(this.#tripPointListComponent.element);

    const replaceCardToForm = () => {
      this.#tripPointListComponent.element.replaceChild(tripPointEditComponent.element, tripPointComponent.element);
    };
    const replaceFormToCard = () => {
      this.#tripPointListComponent.element.replaceChild(tripPointComponent.element, tripPointEditComponent.element);
    };
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    tripPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });
    tripPointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    });
    tripPointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormToCard();
    });

    render(tripPointComponent, this.#tripPointListComponent.element);
  }
}
