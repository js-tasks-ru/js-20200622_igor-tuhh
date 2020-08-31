import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element = document.createElement("div");
  headerElement = document.createElement("div");
  bodyElement = document.createElement("div");
  loadingElement = document.createElement("div");
  emptyPlaceholderElement = document.createElement("div");

  subElements = {
    header: this.headerElement,
    body: this.bodyElement,
    loading: this.loadingElement,
    emptyPlaceholder: this.emptyPlaceholderElement,
  };

  //https://course-js.javascript.ru/api/rest/products?_embed=subcategory.category&_sort=title&_order=asc&_start=0&_end=30

  constructor(headerData = [], {
    url = '',
    sorted = {
      id: headerData.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = false,
    step = 20,
    start = 1,
    end = start + step
  } = {}) {

    this.headerData = headerData;
    this.url = new URL(url, BACKEND_URL);
    this.sorted = sorted;
    this.isSortLocally = isSortLocally;
    this.step = step;
    this.start = start;
    this.end = end;

    this.data = [];

    this.render();

  }

  async render() {
    const { id, order } = this.sorted;
    await this.loadData(id, order);
    this.renderElement();
    this.initEventListeners();
  }

  async loadData({ sort = "title", order = "asc" } = {}) {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set("_start", this.start);
    url.searchParams.set("_end", this.end);
    url.searchParams.set("_sort", sort);
    url.searchParams.set("_order", order);

    const data = await fetchJson(url.href);
    this.data = [...this.data, ...data];

    this.start += this.step;
    this.end += this.step;
    await this.renderElement();
  }

  async update() {
    await this.loadData();
  }

  initialSort({ id, order } = {}) {
    this.sort(id, order);
  }

  initHeaderElement() {
    const records = this.getRecords(this.headerData, this.getHeaderCellTemplate);
    this.initElement(this.headerElement, "header", ["sortable-table__header", "sortable-table__row"], records);
  }

  initBodyElement() {
    this.initElement(this.bodyElement, "body", ["sortable-table__body"], this.getRecords(this.data, this.getBodyRecordTemplate));
  }

  initLoadingElement() {
    this.initElement(this.loadingElement, "loading", ["loading-line", "sortable-table__loading-line"], "");
  }

  initEmptyPlaceholderElement() {
    const html = `<div>
    <p>No products satisfies your filter criteria</p>
    <button type="button" class="button-primary-outline">Reset all filters</button>
    </div>`;
    this.initElement(this.emptyPlaceholderElement, "emptyPlaceholder", ["sortable-table__empty-placeholder"], html);
  }

  initElement(element = new HTMLDivElement(), attr, cssClasses, html) {
    element.setAttribute("data-element", attr);
    element.classList.add(...cssClasses);
    element.innerHTML = html;
  }

  getRecords(array, delegate, args) {
    return array.map((record) => {
      return delegate.bind(this)(record, args);
    }).join("");
  }

  getHeaderCellTemplate(record) {
    const sortTemplate = record.sortable
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
          </span>`
      : "";

    return `<div class="sortable-table__cell" data-id="${record.id}" data-sortable="${record.sortable}">
    <span>${record.title}</span>
    ${sortTemplate}
    </div>`;
  }

  getBodyCellTemplate(headerRecord, args) {
    const bodyRecord = args[0];
    const content = headerRecord.template
      ? headerRecord.template(bodyRecord[headerRecord.id])
      : `<div class="sortable-table__cell">${bodyRecord[headerRecord.id]}</div>`;
    return content;
  }

  getBodyRecordTemplate(bodyRecord) {
    return `<a href="/products/${bodyRecord.id}" class="sortable-table__row">
      ${this.getRecords(this.headerData, this.getBodyCellTemplate, [bodyRecord])}
  </a>`;
  }

  sort(field, orderValue) {
    const sortingFactor = orderValue === "desc" ? -1 : 1;
    const { sortType, customSorting } = this.headerData.find(item => item.id === field);

    this.data.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return sortingFactor * (a[field] - b[field]);
        case 'string':
          return sortingFactor * a[field].localeCompare(b[field], 'ru');
        case 'custom':
          return sortingFactor * customSorting(a, b);
        default:
          return sortingFactor * (a[field] - b[field]);
      }
    });

    this.renderElement();
    this.headerElement.querySelector(`[data-id="${field}"]`).dataset.order = orderValue;
  }

  onSortClick = event => {
    const heading = event.target.closest('[data-sortable="true"]');
    const newOrder = heading.dataset.order === "desc" ? "asc" : "desc";

    if (this.isSortLocally) {
      this.sortLocally(heading.dataset.id, newOrder);
    } else {
      this.sortOnServer(heading.dataset.id, newOrder, 1, 1 + this.step);
    }
  };

  sortLocally(id, order) {
    this.sortData(id, order);
  }

  async sortOnServer(id, order, start, end) {
    this.loadData(id, order, start, end);
    this.renderElement();
  }

  renderElement() {
    this.tableElement = document.createElement("div");
    this.tableElement.classList.add("sortable-table");

    this.initHeaderElement();
    this.initBodyElement();
    this.initLoadingElement();
    this.initEmptyPlaceholderElement();

    for (let subElement of Object.values(this.subElements)) {
      this.tableElement.append(subElement);
    }

    this.element.innerHTML = "";
    this.element.classList.add("products-list__container");
    this.element.setAttribute("data-element", "productsContainer");
    this.element.append(this.tableElement);
  }

  initEventListeners() {
    this.headerElement.addEventListener('pointerdown', this.onSortClick);
    window.addEventListener('scroll', this.onScroll);
  }

  onScroll = async () => {
    const { bottom } = this.element.getBoundingClientRect();
    if (bottom < document.documentElement.clientHeight && !this.loading) {
      this.loading = true;
      await this.loadData();
      this.loading = false;
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.headerElement.removeEventListener('pointerdown', this.onSortClick);
    window.removeEventListener('scroll', this.onScroll);
  }
}
