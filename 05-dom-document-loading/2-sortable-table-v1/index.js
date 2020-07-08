export default class SortableTable {
  element = document.createElement("div");
  _headerElement = document.createElement("div");
  _bodyElement = document.createElement("div");
  _loadingElement = document.createElement("div");
  _emptyPlaceholderElement = document.createElement("div");

  constructor(headerData = [], { data = [] } = {}) {
    this.headerData = headerData;
    this.data = data;
    this.render();
  }

  initHeaderElement() {
    const records = this.getRecords(
      this.headerData,
      this.getHeaderCellTemplate
    );
    this.initElement(
      this._headerElement,
      "header",
      ["sortable-table__header", "sortable-table__row"],
      records
    );
  }

  initBodyElement() {
    this.initElement(
      this._bodyElement,
      "body",
      ["sortable-table__body"],
      this.getRecords(this.data, this.getBodyRecordTemplate)
    );
  }

  initLoadingElement() {
    this.initElement(
      this._loadingElement,
      "loading",
      ["loading-line", "sortable-table__loading-line"],
      ""
    );
  }

  initEmptyPlaceholderElement() {
    const html = `<div>
    <p>No products satisfies your filter criteria</p>
    <button type="button" class="button-primary-outline">Reset all filters</button>
    </div>`;
    this.initElement(
      this._emptyPlaceholderElement,
      "emptyPlaceholder",
      ["sortable-table__empty-placeholder"],
      html
    );
  }

  initElement(element = new HTMLDivElement(), attr, cssClass, html) {
    element.setAttribute("data-element", attr);
    element.classList.add(...cssClass);
    element.innerHTML = html;
  }

  getRecords(array, delegate, args) {
    return array
      .map((record) => {
        return delegate.bind(this)(record, args);
      })
      .join("");
  }

  getHeaderCellTemplate(record) {
    const sortTemplate = record.sortable
      ? `<span class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
          </span>`
      : "";

    return `<div class="sortable-table__cell" data-name="${record.id}" data-sortable="${record.sortable}">
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

  sort(fieldValue, orderValue) {
    const sortingFactor = orderValue === "desc" ? -1 : 1;

    this.data.sort((a, b) => {
      if (typeof a[fieldValue] === "string") {
        return (a[fieldValue].localeCompare(b[fieldValue], "ru-RU", { caseFirst: "upper" }) * sortingFactor);
      } else {
        return (a[fieldValue] - b[fieldValue]) * sortingFactor;
      }
    });

    this.render();
  }

  render() {
    this.tableElement = document.createElement("div");
    this.tableElement.innerHTML = "";
    this.tableElement.classList.add("sortable-table");

    this.initHeaderElement();
    this.initBodyElement();
    this.initLoadingElement();
    this.initEmptyPlaceholderElement();

    for (let [name, subElement] of Object.entries(this.subElements)) {
      this.tableElement.appendChild(subElement);
    }

    this.element.innerHTML = "";
    this.element.classList.add("products-list__container");
    this.element.setAttribute("data-element", "productsContainer");
    this.element.appendChild(this.tableElement);
  }

  subElements = {
    header: this._headerElement,
    body: this._bodyElement,
    loading: this._loadingElement,
    emptyPlaceholder: this._emptyPlaceholderElement,
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
