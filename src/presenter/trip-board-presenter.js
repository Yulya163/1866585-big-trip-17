import {render, RenderPosition, remove} from '../framework/render';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import TripBoardView from '../view/trip-board-view';
import SortingView from '../view/sorting-view';
import TripPointListView from '../view/trip-point-list-view';
import NoPointsView from '../view/no-points-view';
import LoadingView from '../view/loading-view.js';
import TripPointPresenter from './trip-point-presenter';
import TripPointNewPresenter from './trip-point-new-presenter';
import {sortDayUp, sortTimeDown, sortPriceDown} from '../utils/point';
import {filter} from '../utils/filter.js';
import {SortType, UpdateType, UserAction, FilterType} from '../consts';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripBoardPresenter {
  #tripContainer = null;

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filterModel = null;

  #tripBoardComponent = new TripBoardView();
  #tripPointsListComponent = new TripPointListView();
  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #noPointsComponent = null;

  #tripPointPresenter = new Map();
  #tripPointNewPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

  constructor(tripContainer, pointsModel, offersModel, destinationsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filterModel = filterModel;

    this.#tripPointNewPresenter = new TripPointNewPresenter(this.#tripPointsListComponent.element, this.#handleViewAction);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredPoints.sort(sortDayUp);
      case SortType.TIME_DOWN:
        return filteredPoints.sort(sortTimeDown);
      case SortType.PRICE_DOWN:
        return filteredPoints.sort(sortPriceDown);
      default:
        return filteredPoints;
    }
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  init = () => {
    this.#renderTripBoard();
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#tripPointNewPresenter.init(callback, this.offers, this.destinations);
  };

  #handleModeChange = () => {
    this.#tripPointNewPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#tripPointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#tripPointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#tripPointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#tripPointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
      default:
        throw new Error('UserAction does not exist');
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#tripPointPresenter.get(data.id).init(data, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearTripBoard();
        this.#renderTripBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearTripBoard({resetSortType: true});
        this.#renderTripBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderTripBoard();
        break;
      default:
        throw new Error('UpdateType does not exist');
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearTripBoard();
    this.#renderTripBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#tripBoardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView(this.#filterType);
    render(this.#noPointsComponent, this.#tripBoardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderTripPoint = (point, offers, destinations) => {
    const tripPointPresenter = new TripPointPresenter(this.#tripPointsListComponent.element, this.#handleViewAction, this.#handleModeChange);
    tripPointPresenter.init(point, offers, destinations);
    this.#tripPointPresenter.set(point.id, tripPointPresenter);
  };

  #renderTripPoints = (points) => {
    points.forEach((tripPoint) => this.#renderTripPoint(tripPoint, this.offers, this.destinations));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripBoardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #clearTripBoard = ({resetSortType = false} = {}) => {
    this.#tripPointNewPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderTripBoard = () => {
    render(this.#tripBoardComponent, this.#tripContainer);
    render(this.#tripPointsListComponent, this.#tripBoardComponent.element);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderTripPoints(this.points);
  };
}
