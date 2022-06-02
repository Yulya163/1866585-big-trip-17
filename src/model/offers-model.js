import Observable from '../framework/observable.js';
import {allOffers} from '../main';

export default class OffersModel extends Observable {
  #allOffers = allOffers;

  get offers() {
    return this.#allOffers;
  }
}
