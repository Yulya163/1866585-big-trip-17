import SortingView from '../view/sorting-view.js';
import TripPointListView from '../view/trip-point-list-view.js';
import TripPointView from '../view/trip-point-view.js';
//import CreationFormView from '../view/creation-form-view.js';
import EditingFormView from '../view/editing-form-view.js';
import {render} from '../render.js';

export default class TripEventsPresenter {
  tripPointListComponent = new TripPointListView();

  init = (tripContainer) => {
    this.tripContainer = tripContainer;

    render(new SortingView(), this.tripContainer);
    render(this.tripPointListComponent, this.tripContainer);
    render(new EditingFormView(), this.tripPointListComponent.getElement(), 'afterbegin');
    //render(new CreationFormView(), this.tripPointListComponent.getElement(), 'afterbegin');
    render(new TripPointView(), this.tripPointListComponent.getElement());
    render(new TripPointView(), this.tripPointListComponent.getElement());
    render(new TripPointView(), this.tripPointListComponent.getElement());
  };
}
