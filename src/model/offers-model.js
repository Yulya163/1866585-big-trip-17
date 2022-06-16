export default class OffersModel {
  #offersApiService = null;
  #allOffers = [];

  constructor(offersApiService) {
    this.#offersApiService = offersApiService;
  }

  get offers() {
    return this.#allOffers;
  }

  init = async () => {
    try {
      this.#allOffers = await this.#offersApiService.offers;
    } catch(err) {
      this.#allOffers = [];
    }
  };
}
