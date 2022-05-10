import AbstractView from '../framework/view/abstract-view.js';

const createNoPointsTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);

export default class NoPointsView extends AbstractView {
  get template() {
    return createNoPointsTemplate();
  }
}
