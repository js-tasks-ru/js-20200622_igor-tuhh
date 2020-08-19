import fetchJson from './utils/fetch-json.js';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element = document.createElement("div");
  chartHeight = 50;
  subElements = {};

  constructor({
    url = "api/dashboard/orders",
    range = {
      from: new Date('2020-04-06'),
      to: new Date('2020-05-06'),
    },
    label = "Total Orders",
    formatHeading = (data) => data,
    link = "#",
  } = {}) {

    this.data = {};
    this.value = 0;

    this.url = url;
    this.range = range;
    this.label = label;
    this.formatHeading = formatHeading;
    this.link = link;

    this.render();
    this.loadData();
  }

  async loadData() {
    const url = new URL(this.url, BACKEND_URL);
    url.searchParams.set("from", this.range.from);
    url.searchParams.set("to", this.range.to);
    this.data = await fetchJson(url.href);
    this.render();
  }

  async update(from, to) {
    this.range = {
      from: from,
      to: to,
    };
    await this.loadData();
  }

  get chartRecords() {

    return Object.values(this.data)
      .map((item) => {
        const prop = this.getColumnProp(item);
        return `<div style="--value:${prop.value}" data-tooltip="${prop.percent}"></div>`;
      })
      .join("");
  }

  render = () => {
    this.element.className = Object.keys(this.data).length === 0
      ? "column-chart_loading"
      : "column-chart";
    this.value = this.formatHeading(Object.values(this.data).reduce((acc, curr) => acc = acc + curr, 0));
    this.element.innerHTML = `<div class="column-chart__title">
    ${this.label}
    <a href="${this.link}" class="column-chart__link">View all</a>
  </div>
  <div class="column-chart__container">
    <div data-element="header" class="column-chart__header">${this.value}</div>
    <div data-element="body" class="column-chart__chart">
      ${this.chartRecords}
    </div>
  </div>`;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove = () => {
    this.element.remove();
  }

  destroy = () => {
    this.remove();
  }

  getColumnProp(item) {
    const maxValue = Math.max(...Object.values(this.data));
    const scale = 50 / maxValue;

    return {
      percent: ((item / maxValue) * 100).toFixed(0) + "%",
      value: String(Math.floor(item * scale)),
    };
  }
}
