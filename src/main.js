import MenuView from './view/menu-view.js';
import FiltersView from './view/filters-view.js';
import {render} from './render.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';

const sitePageHeaderElement = document.querySelector('.page-header');
const siteTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const siteTripFiltersElement = sitePageHeaderElement.querySelector('.trip-controls__filters');

const siteTripEventsElement = document.querySelector('.trip-events');

const tripEventsPresenter = new TripEventsPresenter();

render(new MenuView(), siteTripMainElement, 'afterbegin');
render(new FiltersView(), siteTripFiltersElement);

tripEventsPresenter.init(siteTripEventsElement);
