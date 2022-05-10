import MenuView from './view/menu-view.js';
import FiltersView from './view/filters-view.js';
import {render} from './framework/render.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

import {generateOffers} from './mock/offers.js';
import {generatePoint} from './mock/point.js';
import {generateDestinations} from './mock/destinations.js';

export const allOffers = generateOffers();
export const points = Array.from({length: 20}, generatePoint);
export const destinations = generateDestinations();

const sitePageHeaderElement = document.querySelector('.page-header');
const siteTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const siteTripFiltersElement = sitePageHeaderElement.querySelector('.trip-controls__filters');

const siteTripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();


render(new MenuView(), siteTripMainElement, 'afterbegin');
render(new FiltersView(), siteTripFiltersElement);

new TripEventsPresenter(siteTripEventsElement, pointsModel, offersModel, destinationsModel);
