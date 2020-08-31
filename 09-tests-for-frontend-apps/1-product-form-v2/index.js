import SortableList from '../2-sortable-list/index.js';
import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  constructor(id) {
    this.id = id;
  }

  async getData(id) {
    const url = new URL(`/api/rest/products`, BACKEND_URL);
    url.searchParams.set("id", id);
    let response = await fetch(url.href);
    if (response.status === 200) {
      this.productData = (await response.json())[0];
    }
  }

  async getCategories() {
    const url = new URL(`/api/rest/categories`, BACKEND_URL);
    url.searchParams.set("_sort", "weight");
    url.searchParams.set("_refs", "subcategory");

    let response = await fetch(url.href);
    if (response.status === 200) {
      this.categoriesData = await response.json();
    }
  }

  submitProduct = event => {

    event.preventDefault();

    const url = new URL(`/api/rest/products`, BACKEND_URL);
    fetch(url.href, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.getUpdatedProduct()),
    })
      .then(response => console.log(response))
      .catch(error => console.error(error));


    if (this.productData) {
      this.element.dispatchEvent(new Event("product-updated"));
    } else {
      this.element.dispatchEvent(new Event("product-saved"));
    }
  }

  getUpdatedProduct() {
    const product = { ...this.productData };
    const form = this.element.querySelector("form");
    for (const key in product) {

      switch (key) {
        case "images":
          const newImages = form.querySelectorAll(`.products-edit__imagelist-item`);
          product[key] = [...newImages].map(liElement => { return { source: liElement.querySelector("input[name='source']").value, url: liElement.querySelector("input[name='url']").value }; });
          break;

        default:
          const newValue = form.querySelector(`[name='${key}']`)?.value;
          if (product.hasOwnProperty(key) && newValue) {
            product[key] = !isNaN(newValue) ? Number.parseInt(newValue) : escapeHtml(newValue);
          }
      }
    }
    return product;
  }

  getFormTemplate() {
    return `<form data-element="productForm" class="form-grid">
    <div class="form-group form-group__half_left">
      <fieldset>
        <label class="form-label">Название товара</label>
        <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
      </fieldset>
    </div>
    <div class="form-group form-group__wide">
      <label class="form-label">Описание</label>
      <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
    </div>
    <div class="form-group form-group__wide" data-element="sortable-list-container">
      <label class="form-label">Фото</label>
      <div data-element="imageListContainer">
      </div>
      <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
    </div>
    <div class="form-group form-group__half_left">
      <label class="form-label">Категория</label>
      <select class="form-control" name="category">
      </select>
    </div>
    <div class="form-group form-group__half_left form-group__two-col">
      <fieldset>
        <label class="form-label">Цена ($)</label>
        <input required="" type="number" name="price" class="form-control" placeholder="100">
      </fieldset>
      <fieldset>
        <label class="form-label">Скидка ($)</label>
        <input required="" type="number" name="discount" class="form-control" placeholder="0">
      </fieldset>
    </div>
    <div class="form-group form-group__part-half">
      <label class="form-label">Количество</label>
      <input required="" type="number" class="form-control" name="quantity" placeholder="1">
    </div>
    <div class="form-group form-group__part-half">
      <label class="form-label">Статус</label>
      <select class="form-control" name="status">
        <option value="1">Активен</option>
        <option value="0">Неактивен</option>
      </select>
    </div>
    <div class="form-buttons">
      <button type="submit" name="save" class="button-primary-outline">
        Сохранить товар
      </button>
    </div>
    <input type="file" name="uploadImage" hidden>
  </form>`;
  }

  getImageTemplate({ source, url } = {}) {
    return `
      <input type="hidden" name="url" value="${url}">
      <input type="hidden" name="source" value="${source}">
      <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${url}">
        <span>${source}</span>
      </span>
      <button type="button">
        <img src="icon-trash.svg" data-delete-handle="" alt="delete">
      </button>
      `;
  }

  async render() {
    this.element = document.createElement("div");
    this.element.classList.add("product-form");
    this.element.innerHTML = this.getFormTemplate();

    if (this.id) {
      await this.getData(this.id);
    }

    await this.getCategories(this.id);

    this.fillForm();

    this.initEventListeners();
  }

  initEventListeners() {
    // image upload
    this.element.querySelector("button[name='uploadImage']").addEventListener("click", this.onUploadButtonClick, false);
    this.element.querySelector("input[name='uploadImage']").addEventListener("change", this.onFileInputFieldChange, false);

    // submit form
    this.element.querySelector("button[name='save']").addEventListener("click", this.submitProduct, false);
  }

  onUploadButtonClick = event => {
    if (fileElement) {
      fileElement.click();
    }
    event.preventDefault();
  }

  onFileInputFieldChange = event => {
    const resultPromise = this.uploadImage(event.target.files[0]);
    resultPromise
      .then(result => {
        const formElement = this.element.querySelector(`[data-element="imageListContainer"] > ul.sortable-list`);
        const imageHtml = this.getImageTemplate({ source: result.data.id, url: result.data.link });
        formElement.insertAdjacentHTML('beforeend', imageHtml);
      })
      .catch(error => console.error(error));
  }

  async uploadImage(imageFile) {
    const formData = new FormData(); // tag <form></form>

    formData.append('image', imageFile);
    formData.append('name', 'John');

    try {
      return await fetchJson('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData,
      });

    } catch (error) {
      console.error(error);
    }
  }

  fillForm() {
    if (this.productData) {
      for (const key in this.productData) {
        if (!this.productData.hasOwnProperty(key)) {
          continue;
        }

        if (key === "images") {
          let imageListContainerElement = this.element.querySelector(`[data-element="imageListContainer"]`);
          const imageElelemnts = this.productData[key].map(image => {
            const imageElement = document.createElement("li");
            imageElement.classList.add("products-edit__imagelist-item");
            imageElement.innerHTML = this.getImageTemplate(image);
            return imageElement;
          });
          const sortableList = new SortableList({ items: imageElelemnts });
          imageListContainerElement.append(sortableList.element);
          continue;
        }


        const formElement = this.element.querySelector(`[name="${key}"]`);
        if (!formElement) {
          continue;
        }

        formElement.value = this.productData[key];
      }
    }

    if (this.categoriesData) {
      const formElement = this.element.querySelector(`select[name="category"]`);
      for (const category of this.categoriesData) {
        for (const subcategory of category.subcategories) {
          const option = document.createElement("option");
          option.value = `${subcategory.id}`;
          option.textContent = `${category.title}/${subcategory.title}`;

          formElement.append(option);
        }
      }
    }
  }

  remove() {
    this.element = null;
  }

  destroy() {
    this.remove();

    // image upload
    this.element.querySelector("button[name='uploadImage']").removeEventListener("click", this.onUploadButtonClick, false);
    this.element.querySelector("input[name='uploadImage']").removeEventListener("change", this.onFileInputFieldChange, false);

    // submit form
    this.element.querySelector("button[name='save']").removeEventListener("click", this.submitProduct, false);
  }
}
