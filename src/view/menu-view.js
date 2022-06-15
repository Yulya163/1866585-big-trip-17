import AbstractView from '../framework/view/abstract-view';
import {humanizePointDueDate} from '../utils/point';

const createTripInfoTitleTemplate = (points) => {
  if (points.length > 3) {
    return `<h1 class="trip-info__title">
      ${points[0].destination.name} &mdash; ... &mdash; ${points[points.length - 1].destination.name}
    </h1>`;
  }

  if (points.length > 0 && points.length <=3) {
    return `<h1 class="trip-info__title">
    ${points.map((point, index) => (`${point.destination.name} ${(points.length - 1) === index ? '' : '&mdash;'} `))
    .join('')}</h1>`;
  }

  return '';
};

const createTripInfoDatesTemplate = (points) => {
  let dateStart = null;
  let dateEnd = null;

  if (points.length) {
    dateStart = points[0].dateFrom !== null
      ? humanizePointDueDate(points[0].dateFrom)
      : '';
    dateEnd = points[points.length - 1].dateTo !== null
      ? humanizePointDueDate(points[points.length - 1].dateTo)
      : '';
  }

  return `<p class="trip-info__dates">
      ${dateStart}&nbsp;&mdash;&nbsp;${dateEnd}
    </p>`;
};

const createTripInfoCostTemplate = (points, offers) => {
  const sum = points.reduce((total, point) => (total + point.basePrice), 0);

  const allCheckedOffers = [];

  if (offers.length) {
    points.forEach((point) => {
      const pointTypeOffers = offers.find((offer) => offer.type === point.type).offers;
      const pointTypeCheckedOffers = pointTypeOffers.filter((offer) => point.offers.includes(offer.id));
      allCheckedOffers.push(...pointTypeCheckedOffers);
    });
  }

  const sumOffers = allCheckedOffers.reduce((total, checkedOffer) => (total + checkedOffer.price), 0);

  const totalSum = sum + sumOffers;

  return `<p class="trip-info__cost">
    Total: &euro;&nbsp;
    <span class="trip-info__cost-value">${totalSum}</span>
  </p>`;
};

const createNewMenuTemplate = (points = [], offers = []) => {
  const tripInfoTitleTemplate = createTripInfoTitleTemplate(points);
  const tripInfoDatesTemplate = createTripInfoDatesTemplate(points);
  const tripInfoCostTemplate = createTripInfoCostTemplate(points, offers);

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    ${points.length ?
    `${tripInfoTitleTemplate}
    ${tripInfoDatesTemplate}` : ''}
  </div>
  ${tripInfoCostTemplate}
  </section>`;
};

export default class MenuView extends AbstractView {
  #pointsSortDay = null;
  #allOffers = null;

  constructor(pointsSortDay = [], allOffers) {
    super();
    this.#pointsSortDay = pointsSortDay;
    this.#allOffers = allOffers;
  }

  get template() {
    return createNewMenuTemplate(this.#pointsSortDay, this.#allOffers);
  }
}
