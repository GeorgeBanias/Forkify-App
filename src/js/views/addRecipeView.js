import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
    this._storeOriginalForm();
    this._shouldReset = false; // Track if form should be reset on next open
  }

  _storeOriginalForm() {
    // Store the original form HTML when the page loads
    this._originalFormHTML = this._parentElement.innerHTML;
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');

    // Reset form only when opening the window and if flag is set
    if (!this._window.classList.contains('hidden') && this._shouldReset) {
      this._resetForm();
      this._shouldReset = false; // Reset the flag
    }
  }

  markForReset() {
    // Call this method to mark that form should be reset on next open
    this._shouldReset = true;
  }

  _resetForm() {
    // Restore the original form content and clear any previous messages/spinners
    this._parentElement.innerHTML = this._originalFormHTML;
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
