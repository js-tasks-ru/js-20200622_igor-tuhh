export default class RangePicker {

  selectingFlag = 0; // 0 - nothing selected, 1 - selected from, 2 - selected from and to

  constructor({ from, to } = {}) {
    this.from = from;
    this.to = to;

    this.selectorDate = new Date(this.to);

    this.render();
  }

  getInput() {
    return `<span data-element="from">${this.from.toLocaleDateString()}</span> -
    <span data-element="to">${this.to.toLocaleDateString()}</span>`;
  }

  getSelector() {
    const previousMonth = new Date(this.selectorDate);
    previousMonth.setMonth(this.selectorDate.getMonth() - 1);
    const firstMonthName = previousMonth.toLocaleString('ru', { month: 'long' });
    const secondMonthName = this.selectorDate.toLocaleString('ru', { month: 'long' });

    return `<div class="rangepicker__selector-arrow"></div>
    <div class="rangepicker__selector-control-left"></div>
    <div class="rangepicker__selector-control-right"></div>
    <div class="rangepicker__calendar">
            <div class="rangepicker__month-indicator">
                    <time datetime="${firstMonthName}">${firstMonthName}</time>
            </div>
            <div class="rangepicker__day-of-week">
                    <div>Пн</div>
                    <div>Вт</div>
                    <div>Ср</div>
                    <div>Чт</div>
                    <div>Пт</div>
                    <div>Сб</div>
                    <div>Вс</div>
            </div>
            <div class="rangepicker__date-grid">
                    ${this.getDaysInMonth(previousMonth)}
            </div>
    </div>
    <div class="rangepicker__calendar">
            <div class="rangepicker__month-indicator">
                    <time datetime="${secondMonthName}">${secondMonthName}</time>
            </div>
            <div class="rangepicker__day-of-week">
                    <div>Пн</div>
                    <div>Вт</div>
                    <div>Ср</div>
                    <div>Чт</div>
                    <div>Пт</div>
                    <div>Сб</div>
                    <div>Вс</div>
            </div>
            <div class="rangepicker__date-grid">
                    ${this.getDaysInMonth(this.selectorDate)}
            </div>
    </div>`;
  }

  getButton(date, additionalAttributes, additionalClasses) {
    return `<button type="button" class="rangepicker__cell ${additionalClasses}"
    data-value="${date}" ${additionalAttributes}>${date.toLocaleString('ru', { day: "2-digit" })}</button>`;
  }

  getDaysInMonth(date) {
    date = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDay = date.getDay();
    let daysHtml = this.getButton(date, `style="--start-from: ${startDay === 0 ? 7 : startDay}"`);
    date.setDate(date.getDate() + 1);

    const month = date.getMonth();
    while (date.getMonth() === month) {
      if (date.getTime() === this.from.getTime()) {
        daysHtml += this.getButton(date, "", "rangepicker__selected-from");
      } else if (date.getTime() > this.from.getTime() && date.getTime() < this.to.getTime()) {
        daysHtml += this.getButton(date, "", "rangepicker__selected-between");
      } else if (date.getTime() === this.to.getTime()) {
        daysHtml += this.getButton(date, "", "rangepicker__selected-to");
      } else {
        daysHtml += this.getButton(date);
      }
      date.setDate(date.getDate() + 1);
    }
    return daysHtml;
  }

  render() {
    const input = document.createElement("div");
    input.classList.add("rangepicker__input");
    input.dataset.element = "input";
    input.innerHTML = this.getInput();

    const selector = document.createElement("div");
    selector.classList.add("rangepicker__selector");
    selector.dataset.element = "selector";
    selector.innerHTML = this.getSelector();


    this.element = document.createElement("div");
    this.element.classList.add("rangepicker");
    this.element.append(input);
    this.element.append(selector);

    this.initEventsHandler();
  }

  initEventsHandler() {
    document.addEventListener("pointerdown", this.onBodyClick, false);
  }

  onBodyClick = event => {

    if (this.element.classList.contains("rangepicker_open") && !event.target.closest(".rangepicker__selector")) {
      this.element.classList.remove("rangepicker_open");
    } else if (event.target.closest(".rangepicker__input")) {
      this.element.classList.add("rangepicker_open");
    }

    if (event.target.closest(".rangepicker__selector-control-right")) {
      this.selectorDate.setMonth(this.selectorDate.getMonth() + 1);
      this.element.querySelector("[data-element='selector']").innerHTML = this.getSelector();
    }

    if (event.target.closest(".rangepicker__selector-control-left")) {
      this.selectorDate.setMonth(this.selectorDate.getMonth() - 1);
      this.element.querySelector("[data-element='selector']").innerHTML = this.getSelector();
    }

    if (event.target.closest(".rangepicker__cell")) {
      const buttonElement = event.target.closest(".rangepicker__cell");
      if (this.selectingFlag === 0 || this.selectingFlag === 2) {
        this.from = new Date(buttonElement.dataset.value);
        this.selectingFlag = 1;
      } else if (this.selectingFlag === 1) {
        this.to = new Date(buttonElement.dataset.value);
        this.selectingFlag = 2;
      }
      this.element.querySelector("[data-element='input']").innerHTML = this.getInput();
      this.element.querySelector("[data-element='selector']").innerHTML = this.getSelector();
    }
  }


  remove() {
    this.element = null;
  }

  destroy() {
    this.remove();
  }
}
