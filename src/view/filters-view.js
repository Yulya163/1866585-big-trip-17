import AbstractView from '../framework/view/abstract-view';

const createFilterItemTemplate = (filter, isChecked, isDisabled) => {
  const {name} = filter;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter__${name}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="everything"
        ${isChecked ? 'checked' : ''}
        ${isDisabled && !isChecked ? 'disabled' : ''}
      />
      <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

const createFiltersTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0, index !== 0))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FiltersView extends AbstractView {
  #filters = null;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
