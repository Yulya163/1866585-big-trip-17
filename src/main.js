import MenuView from './view/menu-view';
import NewPointButtonView from './view/new-point-button-view';
import {render} from './framework/render';
import TripBoardPresenter from './presenter/trip-board-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';

import {generateOffers} from './mock/offers';
import {generatePoint} from './mock/point';
import {generateDestinations} from './mock/destinations';

export const allOffers = generateOffers();
export const points = Array.from({length: 10}, generatePoint);
export const destinations = generateDestinations();

const sitePageHeaderElement = document.querySelector('.page-header');
const siteTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const siteTripFiltersElement = sitePageHeaderElement.querySelector('.trip-controls__filters');

const siteTripEventsContainerElement = document.querySelector('main .page-body__container');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const tripBoardPresenter = new TripBoardPresenter(siteTripEventsContainerElement, pointsModel, offersModel, destinationsModel, filterModel);
const filterPresenter = new FilterPresenter(siteTripFiltersElement, filterModel, pointsModel);
const newPointButtonComponent = new NewPointButtonView();

render(new MenuView(), siteTripMainElement, 'afterbegin');
const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripBoardPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

render(newPointButtonComponent, siteTripMainElement);
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);

filterPresenter.init();
tripBoardPresenter.init();
