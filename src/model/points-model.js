import {points} from '../main';

export default class PointsModel {
  #points = points;

  get points() {
    return this.#points;
  }
}
