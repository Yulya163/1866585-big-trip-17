import {render, replace, remove} from '../framework/render';
import MenuView from '../view/menu-view';
import {sortDayUp} from '../utils/point';

export default class MenuPresenter {
  #menuContainer = null;
  #pointsModel = null;
  #offersModel = null;

  #menuComponent = null;

  constructor(menuContainer, pointsModel, offersModel) {
    this.#menuContainer = menuContainer;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.init();
  }

  get points() {
    return this.#pointsModel.points.sort(sortDayUp);
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init = () => {
    const points = this.points;
    const offers = this.offers;

    const prevMenuComponent = this.#menuComponent;

    this.#menuComponent = new MenuView(points, offers);

    if (prevMenuComponent === null) {
      render(this.#menuComponent, this.#menuContainer, 'afterbegin');
      return;
    }

    replace(this.#menuComponent, prevMenuComponent);
    remove(prevMenuComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
