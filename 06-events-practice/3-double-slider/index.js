export default class DoubleSlider {

  constructor({
    min = 100,
    max = 200,
    formatValue = value => '$' + value,
    selected = {
      from: min,
      to: max
    }
  } = {}) {

    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;

    this.element = document.createElement("div");
    this.element.classList.add("range-slider");

    this.initEventListeners();
    this.render();

    this.initialize();
  }

  onPointerDown = (event) => {
    this.currentTarget = event.target.closest("[data-element='thumbLeft']") || event.target.closest("[data-element='thumbRight']");
    if (!this.currentTarget) {
      return;
    }

    this.element.classList.add('range-slider_dragging');

    document.addEventListener("pointerup", this.onPointerUp);
    document.addEventListener("pointermove", this.onPointerMove);
  }

  onPointerUp = (event) => {
    this.element.classList.remove('range-slider_dragging');

    document.removeEventListener("pointermove", this.onPointerMove);
    document.removeEventListener("pointerup", this.onPointerUp);

    this.element.dispatchEvent(new CustomEvent('range-select', {
      detail: this.getValue(),
      bubbles: true
    }));
  }

  onPointerMove = (event) => {
    event.preventDefault();
    let x = event.clientX;

    if (this.currentTarget === this.subElements.thumbRightElement) {

      let rightSidePercent = this.getRightSidePercent(x);
      const leftSidePercent = parseFloat(this.subElements.thumbLeftElement.style.left);

      if (rightSidePercent + leftSidePercent > 100) {
        rightSidePercent = 100 - leftSidePercent;
      }

      this.subElements.thumbRightElement.style.right = rightSidePercent + "%";
      this.subElements.progressElement.style.right = rightSidePercent + "%";

      this.subElements.toElement.textContent = this.formatValue(this.getValue().to);
    }
    else if (this.currentTarget === this.subElements.thumbLeftElement) {

      let leftPercent = this.getLeftSidePercent(x);
      const rightSidePercent = parseFloat(this.subElements.thumbRightElement.style.right);

      if (leftPercent + rightSidePercent > 100) {
        leftPercent = 100 - rightSidePercent;
      }

      this.subElements.thumbLeftElement.style.left = leftPercent + "%";
      this.subElements.progressElement.style.left = leftPercent + "%";

      this.subElements.fromElement.textContent = this.formatValue(this.getValue().from);
    }

  }

  getLeftSidePercent(x) {
    const { left, width } = this.subElements.innerElement.getBoundingClientRect();

    if (x > left + width) {
      x = width;
    } else if (x < left) {
      x = 0;
    } else {
      x -= left;
    }

    return x / (width / 100);
  }

  getRightSidePercent(x) {
    return 100 - this.getLeftSidePercent(x);
  }

  getValue() {
    const rangeTotal = this.max - this.min;
    const { left } = this.subElements.thumbLeftElement.style;
    const { right } = this.subElements.thumbRightElement.style;

    const from = Math.round(this.min + parseFloat(left) * 0.01 * rangeTotal);
    const to = Math.round(this.max - parseFloat(right) * 0.01 * rangeTotal);

    return { from, to };
  }

  getTemplate() {

    const { from, to } = this.selected;

    return `<span data-element="from">${this.formatValue(from)}</span>
    <div data-element="inner" class="range-slider__inner">
      <span data-element="progress" class="range-slider__progress"></span>
      <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
      <span data-element="thumbRight" class="range-slider__thumb-right"></span>
    </div>
    <span data-element="to">${this.formatValue(to)}</span>`;
  }

  render() {
    this.element.innerHTML = this.getTemplate();
  }

  initialize() {
    const rangeTotal = this.max - this.min;
    const left = Math.floor((this.selected.from - this.min) / rangeTotal * 100) + '%';
    const right = Math.floor((this.max - this.selected.to) / rangeTotal * 100) + '%';

    this.subElements.progressElement.style.left = left;
    this.subElements.progressElement.style.right = right;

    this.subElements.thumbLeftElement.style.left = left;
    this.subElements.thumbRightElement.style.right = right;
  }

  initEventListeners() {
    document.addEventListener("pointerdown", this.onPointerDown);
  }

  get subElements() {
    return {
      fromElement: this.element.querySelector("[data-element='from']"),
      toElement: this.element.querySelector("[data-element='to']"),
      progressElement: this.element.querySelector("[data-element='progress']"),
      thumbLeftElement: this.element.querySelector("[data-element='thumbLeft']"),
      thumbRightElement: this.element.querySelector("[data-element='thumbRight']"),
      innerElement: this.element.querySelector("[data-element='inner']")
    };
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    document.removeEventListener("pointerdown", this.onPointerDown);
    document.removeEventListener("pointerup", this.onPointerUp);
    this.remove();
  }

}
