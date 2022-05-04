import {generateOffers} from '../mock/offers.js';

export default class OffersModel {
  allOffers = generateOffers();

  getOffers = () => this.allOffers;
}
