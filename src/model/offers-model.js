import {generateOffers} from '../mock/offers.js';

export default class OffersModel {
  #allOffers = generateOffers();

  get offers() {
    return this.#allOffers;
  }
}
