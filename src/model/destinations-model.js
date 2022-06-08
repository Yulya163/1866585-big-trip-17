export default class DestinationsModel {
  #destinationsApiService = null;
  #destinations = [];

  constructor(destinationsApiService) {
    this.#destinationsApiService = destinationsApiService;
    this.init();
  }

  init = async () => {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  };

  get destinations() {
    return this.#destinations;
  }
}
