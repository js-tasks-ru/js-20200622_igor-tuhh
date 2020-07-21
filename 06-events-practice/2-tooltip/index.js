class Tooltip {
  element = document.createElement("div");
  static instance = null;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    this.instance = this;
    this.render();
  }

  initialize() {
    this.initEventListeners();
  }

  onPointOver = (event) => {

    const target = event.target.closest("[data-tooltip]");
    if (!target) {
      return;
    }

    this.element.textContent = target.dataset.tooltip;
    document.body.appendChild(this.element);
  }


  onPointOut = (event) => {

    if (!event.target.closest("[data-tooltip]")) {
      return;
    }

    this.remove();
  }

  onPointMove = (event) => {

    if (!event.target.closest("[data-tooltip]")) {
      return;
    }

    this.element.style.top = event.y + "px";
    this.element.style.left = event.x + "px";
  }

  render() {
    this.element.innerHTML = this.template;
    this.element.classList.add("tooltip");
  }

  initEventListeners() {
    document.addEventListener("pointerover", this.onPointOver);
    document.addEventListener("pointerout", this.onPointOut);
    document.addEventListener("pointermove", this.onPointMove);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    Tooltip.instance = null;
    document.removeEventListener("pointerover", this.onPointOver);
    document.removeEventListener("pointerout", this.onPointOut);
    document.removeEventListener("pointermove", this.onPointMove);
  }
}

const tooltip = new Tooltip();

export default tooltip;
