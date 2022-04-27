import {createElement} from '../render.js';

const createTripListTemplate = () => '<ul class="trip-events__list"></ul>';

export default class TripPointListView {
  getTemplate() {
    return createTripListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
