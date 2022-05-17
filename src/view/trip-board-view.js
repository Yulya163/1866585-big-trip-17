import AbstractView from '../framework/view/abstract-view';

const createTripBoardTemplate = () => (
  `<section class="trip-events">
    <h2 class="visually-hidden">Trip events</h2>
  </section>`
);

export default class TripBoardView extends AbstractView {
  get template() {
    return createTripBoardTemplate();
  }
}
