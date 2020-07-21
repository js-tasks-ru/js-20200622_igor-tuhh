export default class NotificationMessage {
  element = document.createElement("div");
  static instance = null;

  constructor(message, { duration = 20, type = "success" } = {}) {
    if (NotificationMessage.instance) {
      NotificationMessage.instance.destroy();
    }

    NotificationMessage.instance = this;
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.render();
  }

  get template() {
    return `
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${this.type}</div>
      <div class="notification-body">
        ${this.message}
      </div>
    </div>`;
  }

  show(target = document.body) {
    target.append(this.element);
    setTimeout(() => this.destroy(), this.duration);
  }

  render() {
    this.element.innerHTML = this.template;
    this.element.style = `--value:${this.duration}ms`;
    this.element.classList.add("notification", `${this.type}`);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    NotificationMessage.instance = null;
  }
}
