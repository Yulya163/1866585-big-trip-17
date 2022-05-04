import {createElement} from '../render.js';

const createNoPointsTemplate = () => (
  `<p class="trip-events__msg">Click New Event to create your first point</p>`
);

export default class noPointsView {
  #element = null;

  get template() {
    return createNoPointsTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
