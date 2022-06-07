export default class OffersModel {
  #offersApiService = null;
  #allOffers = [];

  constructor(offersApiService) {
    this.#offersApiService = offersApiService;
    this.init();
  }

  init = async () => {
    try {
      this.#allOffers = await this.#offersApiService.offers;
    } catch(err) {
      this.#allOffers = [];
    }
  };

  get offers() {
    return this.#allOffers;
  }
}
