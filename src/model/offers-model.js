import {allOffers} from '../main';

export default class OffersModel {
  #allOffers = allOffers;

  get offers() {
    return this.#allOffers;
  }
}
