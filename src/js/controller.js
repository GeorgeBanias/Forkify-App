import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipieView from './views/recipieView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot){
//   module.hot.accept();
// }
const recipeContainer = document.querySelector('.recipe');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    //1 Loading recipe
    recipieView.renderSpinner();

    // Update results view to mark selected result
    resultsView.update(model.getSearchResultsPage());

    // Update bookmarsk view

    bookmarksView.update(model.state.bookmarks);
    // load recipe
    await model.loadRecipe(id);
    //  Rendering recipe
    recipieView.render(model.state.recipe);
  } catch (err) {
    recipieView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1. Get Search Querry
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load the results from model (state results)

    await model.loadSearchResults(query);

    // 3) Render results

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4) render initial pagignation buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // 2) render new pagignation buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings(in state)
  model.updateServings(newServings);
  //Update the recipe view
  // recipieView.render(model.state.recipe);
  recipieView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //2) Update recipe view
  recipieView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmars = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner

    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipieView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      addRecipeView.markForReset(); // Mark form for reset on next open
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('!@#!@#', err);
    addRecipeView.renderError(err.message);
    // Mark for reset after error so next open will be clean
    addRecipeView.markForReset();
  }

  // UpdateRecipeData
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmars);
  recipieView.addHandlerRender(controlRecipes);
  recipieView.addHandlerUpdateServings(controlServings);
  recipieView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
