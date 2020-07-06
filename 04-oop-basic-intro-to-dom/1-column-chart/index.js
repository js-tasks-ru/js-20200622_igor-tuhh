export default class ColumnChart {
  element = document.createElement("div");
  chartHeight = 50;

  constructor({
    data = [],
    label = "Total Orders",
    value = 0,
    link = "#",
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  update({ bodyData = [] } = {}) {
    this.data = bodyData;
  }

  get chartRecords() {
    return this.data
      .map((item) => {
        const prop = this.getColumnProp(item);
        return `<div style="--value:${prop.value}" data-tooltip="${prop.percent}"></div>`;
      })
      .join("");
  }

  render() {
    this.element.className = !this.data.length
      ? "column-chart_loading"
      : "column-chart";
    this.element.innerHTML = `<div class="column-chart__title">
    ${this.label}
    <a href="${this.link}" class="column-chart__link">View all</a>
  </div>
  <div class="column-chart__container">
    <div class="column-chart__header">${this.value}</div>
    <div class="column-chart__chart">
      ${this.chartRecords}
    </div>
  </div>`;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  getColumnProp(item) {
    const maxValue = Math.max(...this.data);
    const scale = 50 / maxValue;

    return {
      percent: ((item / maxValue) * 100).toFixed(0) + "%",
      value: String(Math.floor(item * scale)),
    };
  }
}
