class Tooltip {
  static instance = null;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize() {
    this.initEventListeners();
  }

  onPointOver = ({ target }) => {

    const tooltipElement = target.closest("[data-tooltip]");
    if (!target) {
      return;
    }

    this.render(tooltipElement.dataset.tooltip);
    document.addEventListener("pointermove", this.onPointMove);
  }


  onPointOut = ({ target }) => {

    if (!target.closest("[data-tooltip]")) {
      return;
    }

    this.remove();
    document.removeEventListener("pointermove", this.onPointMove);
  }

  onPointMove = (event) => {

    if (!event.target.closest("[data-tooltip]")) {
      return;
    }

    this.element.style.top = event.y + "px";
    this.element.style.left = event.x + "px";
  }

  render(tooltip) {
    this.element = document.createElement("div");
    this.element.textContent = tooltip;
    this.element.classList.add("tooltip");

    document.body.append(this.element);
  }

  initEventListeners() {
    document.addEventListener("pointerover", this.onPointOver);
    document.addEventListener("pointerout", this.onPointOut);

  }

  remove() {
    this.element.remove();
  }

  destroy() {
    document.removeEventListener("pointerover", this.onPointOver);
    document.removeEventListener("pointerout", this.onPointOut);
    Tooltip.instance = null;
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
