export default class SortableList {

  currentDragElement = null;
  isKeyDown = false;
  oldY = null;

  constructor({ items = [] } = {}) {
    this.elements = items;

    this.element = document.createElement("ul");
    this.element.classList.add("sortable-list");

    this.render();
  }

  render() {

    this.elements.forEach(item => {
      item.classList.add("sortable-list__item");
      this.element.append(item);
    });

    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener("mousedown", this.onMouseDown, false);
    document.addEventListener("mouseup", this.onMouseUp, false);
  }

  onMouseDown = event => {

    this.oldY = event.pageY;
    this.isKeyDown = true;

    this.placeholder = document.createElement("div");
    this.placeholder.classList.add("sortable-list__placeholder")

    const closestDragElement = event.target.closest(".sortable-list__item");
    const closestDragButton = event.target.closest("[data-grab-handle]");
    const closestDeleteButton = event.target.closest("[data-delete-handle]");

    if (closestDeleteButton && closestDragElement) {
      closestDragElement.remove();
    } else if (closestDragButton && closestDragElement) {
      document.addEventListener("mousemove", this.onMouseMove, false);
      this.currentDragElement = closestDragElement;
      this.currentDragElement.classList.add("sortable-list__item_dragging");
    }
  }

  onMouseMove = event => {

    const directionToBottom = event.pageY > this.oldY;
    if (this.isKeyDown) {
      const closestDragElement = document.elementsFromPoint(event.pageX, event.pageY)
        .find(element => !element.classList.contains("sortable-list__item_dragging") && element.classList.contains("sortable-list__item"));

      if (closestDragElement) {
        this.element.insertBefore(this.placeholder, directionToBottom ? closestDragElement.nextSibling : closestDragElement);
      }

      console.log(closestDragElement);
      this.moveAt(this.currentDragElement, event);

    }

    this.oldY = event.pageY;
  }

  onMouseUp = event => {

    this.isKeyDown = false;
    document.removeEventListener("mousemove", this.onMouseMove, false);


    this.currentDragElement.classList.remove("sortable-list__item_dragging");
    this.currentDragElement.style = "";
    this.element.insertBefore(this.currentDragElement, this.placeholder);
    this.placeholder.remove();

  }

  moveAt(element, event) {
    element.style.left = event.pageX - element.offsetWidth / 2 + 'px';
    element.style.top = event.pageY - element.offsetHeight / 2 + 'px';
  }
}
