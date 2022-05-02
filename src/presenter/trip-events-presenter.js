import SortingView from '../view/sorting-view.js';
import TripPointListView from '../view/trip-point-list-view.js';
import TripPointView from '../view/trip-point-view.js';
import FormView from '../view/form-view.js';
import {render} from '../render.js';

export default class TripEventsPresenter {
  tripPointListComponent = new TripPointListView();

  init = (tripContainer, pointsModel, offersModel) => {
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
    this.offersModel = offersModel;
    this.tripPoints = [...this.pointsModel.getPoints()];
    this.allOffers = [...this.offersModel.getOffers()];

    render(new SortingView(), this.tripContainer);
    render(this.tripPointListComponent, this.tripContainer);
    render(new FormView(this.tripPoints[0], this.allOffers), this.tripPointListComponent.getElement(), 'afterbegin');

    for (let i = 1; i < this.tripPoints.length; i++) {
      render(new TripPointView(this.tripPoints[i], this.allOffers), this.tripPointListComponent.getElement());
    }
  };
}
