import Observable from '../framework/observable.js';
import {destinations} from '../main';

export default class DestinationsModel extends Observable {
  #destinations = destinations;

  get destinations() {
    return this.#destinations;
  }
}
