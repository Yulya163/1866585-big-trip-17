export default class DestinationsModel {
  #destinationsApiService = null;
  #destinations = [];

  constructor(destinationsApiService) {
    this.#destinationsApiService = destinationsApiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      this.#destinations = await this.#destinationsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  };
}
