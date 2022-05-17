import {render, RenderPosition} from '../framework/render';
import TripBoardView from '../view/trip-board-view';
import SortingView from '../view/sorting-view';
import TripPointListView from '../view/trip-point-list-view';
import NoPointsView from '../view/no-points-view';
import TripPointPresenter from './trip-point-presenter';
import {updateItem} from '../utils/common';
import {sortDayUp, sortTimeDown, sortPriceDown} from '../utils/point';
import {SortType} from '../consts';

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
  #currentSortType = SortType.DEFAULT;
  #sourcedTripPoints = [];

  constructor(tripContainer, pointsModel, offersModel, destinationsModel,) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.init();
  }

  init = () => {
    this.#tripPoints = [...this.#pointsModel.points].sort(sortDayUp);
    this.#allOffers = [...this.#offersModel.offers];
    this.#allDestinations = [...this.#destinationsModel.destinations];

    this.#sourcedTripPoints = [...this.#pointsModel.points].sort(sortDayUp);

    this.#renderTripBoard();
  };

  #handleModeChange = () => {
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedPoint);
    this.#tripPointPresenter.get(updatedPoint.id).init(updatedPoint, this.#allOffers, this.#allDestinations);
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME_DOWN:
        this.#tripPoints.sort(sortTimeDown);
        break;
      case SortType.PRICE_DOWN:
        this.#tripPoints.sort(sortPriceDown);
        break;
      default:
        this.#tripPoints = [...this.#sourcedTripPoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearTripPointsList();
    this.#renderTripPointsList();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#tripBoardComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

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
