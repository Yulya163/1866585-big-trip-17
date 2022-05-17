import {destinations} from '../main';

export default class DestinationsModel {
  #destinations = destinations;

  get destinations() {
    return this.#destinations;
  }
}
