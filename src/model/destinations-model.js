import {generateDestinations} from '../mock/destinations.js';

export default class DestinationsModel {
  #destinations = generateDestinations();

  get destinations() {
    return this.#destinations;
  }
}
