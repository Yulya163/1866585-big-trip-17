import MenuView from './view/menu-view.js';
import FiltersView from './view/filters-view.js';
import NewPointButtonView from './view/new-point-button-view.js';
import {render} from './framework/render.js';
import TripBoardPresenter from './presenter/trip-board-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

import {generateOffers} from './mock/offers.js';
import {generatePoint} from './mock/point.js';
import {generateDestinations} from './mock/destinations.js';
import {generateFilter} from './utils/filter.js';

export const allOffers = generateOffers();
export const points = Array.from({length: 20}, generatePoint);
export const destinations = generateDestinations();

const sitePageHeaderElement = document.querySelector('.page-header');
const siteTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const siteTripFiltersElement = sitePageHeaderElement.querySelector('.trip-controls__filters');

const siteTripEventsContainerElement = document.querySelector('main .page-body__container');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const filters = generateFilter();

render(new MenuView(), siteTripMainElement, 'afterbegin');
render(new FiltersView(filters), siteTripFiltersElement);
render(new NewPointButtonView(), siteTripMainElement);

new TripBoardPresenter(siteTripEventsContainerElement, pointsModel, offersModel, destinationsModel);
