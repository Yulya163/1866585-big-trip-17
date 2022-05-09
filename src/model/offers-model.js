import {allOffers} from '../main.js';

export default class OffersModel {
  #allOffers = allOffers;

  get offers() {
    return this.#allOffers;
  }
}
