import MenuView from './view/menu-view';
import NewPointButtonView from './view/new-point-button-view';
import {render} from './framework/render';
import TripBoardPresenter from './presenter/trip-board-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';
import FilterModel from './model/filter-model';
import PointsApiService from './api-services/points-api-service';
import OffersApiService from './api-services/offers-api-service';
import DestinationsApiService from './api-services/destinations-api-service';

const AUTHORIZATION = 'Basic Fghe15Jdw3FFnmxL';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const sitePageHeaderElement = document.querySelector('.page-header');
const siteTripMainElement = sitePageHeaderElement.querySelector('.trip-main');
const siteTripFiltersElement = sitePageHeaderElement.querySelector('.trip-controls__filters');

const siteTripEventsContainerElement = document.querySelector('main .page-body__container');

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OffersApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const tripBoardPresenter = new TripBoardPresenter(siteTripEventsContainerElement, pointsModel, offersModel, destinationsModel, filterModel);
const newPointButtonComponent = new NewPointButtonView();

render(new MenuView(), siteTripMainElement, 'afterbegin');
const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripBoardPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

new FilterPresenter(siteTripFiltersElement, filterModel, pointsModel);
pointsModel.init()
  .finally(() => {
    render(newPointButtonComponent, siteTripMainElement);
    newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
  });
