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

  constructor(headerData = [], { data = [], sorted = { id: headerData.find(item => item.sortable).id, order: 'asc' } } = {}) {
    this.headerData = headerData;
    this.data = data;
    this.initialSort(sorted);
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

    this.render();
    this.headerElement.querySelector(`[data-id="${field}"]`).dataset.order = orderValue;
  }

  render() {
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

    this.initEventListeners();
  }

  initEventListeners() {
    this.headerElement.addEventListener('pointerdown', this.onSortClick);
  }

  onSortClick = event => {
    const heading = event.target.closest('[data-sortable="true"]');
    const newOrder = heading.dataset.order === "desc" ? "asc" : "desc";
    this.sort(heading.dataset.id, newOrder);
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
