import {points} from '../main.js';

export default class PointsModel {
  #points = points;

  get points() {
    return this.#points;
  }
}
