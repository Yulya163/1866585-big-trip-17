import {render, RenderPosition} from '../framework/render.js';
import TripBoardView from '../view/trip-board-view.js';
import SortingView from '../view/sorting-view.js';
import TripPointListView from '../view/trip-point-list-view.js';
import NoPointsView from '../view/no-points-view.js';
import TripPointPresenter from './trip-point-presenter.js';
import {updateItem} from '../utils/common.js';

export default class TripBoardPresenter {
  #tripContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #tripBoardComponent = new TripBoardView();
  #tripPointsListComponent = new TripPointListView();
  #sortComponent = new SortingView();
  #noPointsComponent = new NoPointsView();

  #tripPoints = [];
  #allOffers = [];
  #allDestinations = [];
  #tripPointPresenter = new Map();

  constructor(tripContainer, pointsModel, offersModel, destinationsModel,) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.init();
  }

  init = () => {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#allOffers = [...this.#offersModel.offers];
    this.#allDestinations = [...this.#destinationsModel.destinations];

    this.#renderTripBoard();
  };

  #handleModeChange = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#tripPointPresenter.get(updatedPoint.id).init(updatedPoint, this.#allOffers, this.#allDestinations);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripBoardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    render(this.#noPointsComponent, this.#tripBoardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderTripPoint = (point, offers, destinations) => {
    const tripPointPresenter = new TripPointPresenter(this.#tripPointsListComponent.element, this.#handlePointChange, this.#handleModeChange);
    tripPointPresenter.init(point, offers, destinations);
    this.#tripPointPresenter.set(point.id, tripPointPresenter);
  };

  #renderTripPoints = () => {
    this.#tripPoints.forEach((tripPoint) => {
      this.#renderTripPoint(tripPoint, this.#allOffers, this.#allDestinations);
    });
  };

  #clearTripPointsList = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();
  };

  #renderTripPointsList = () => {
    render(this.#tripPointsListComponent, this.#tripBoardComponent.element);
    this.#renderTripPoints();
  };

  #renderTripBoard = () => {
    render(this.#tripBoardComponent, this.#tripContainer);

    if (this.#tripPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderTripPointsList();
  };
}
