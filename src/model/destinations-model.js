import {generateDestinations} from '../mock/destinations.js';

export default class DestinationsModel {
  allDestinations = generateDestinations();

  getDestinations = () => this.allDestinations;
}
