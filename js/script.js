"use strict";

import { getposts, getSpotters, deletePost, creatPostObject, updatePostObject } from "./rest.js";

let posts;
let postsFiltered;
let spotters;
window.addEventListener("load", startApp);

// ---------- startApp / initial start function ---------- \\
async function startApp() {
  //updating the posts grid
  updateGrid();

  // ---------- Eventlisteners ---------- \\
  //create(post)
  document.querySelector("#create-btn-main").addEventListener("click", showCreateClicked);
  document.querySelector("#create-mushroom-form").addEventListener("submit", createFormClicked);
  document.querySelector("#create-mushroom-form .btn-cancel").addEventListener("click", cancelCreate);

  //update(put)
  document.querySelector("#update-mushroom-form").addEventListener("submit", updateClicked);
  document.querySelector("#update-mushroom-form .btn-cancel").addEventListener("click", cancelUpdate);

  //delete(delete)
  document.querySelector("#delete-post-form .btn-cancel").addEventListener("click", cancelDelete);
  document.querySelector("#delete-post-form").addEventListener("submit", executeDelete);

  //search
  document.querySelector("#search-text").addEventListener("keyup", inputSearchChanged);
  document.querySelector("#search-text").addEventListener("search", inputSearchChanged);

  //sort
  document.querySelector("#sort-by").addEventListener("change", sortBy);

  //filters
  document.querySelector("#edible").addEventListener("change", filterPosts);
  document.querySelector("#poisonous").addEventListener("change", filterPosts);
  document.querySelector("#recentWeek").addEventListener("change", filterPosts);
}

// ---------- updateGrid / updating the posts grid ---------- \\
async function updateGrid() {
  posts = await getposts();
  spotters = await getSpotters();
  console.log(posts);
  console.log(spotters);
  // console.table(posts, posts);

  showSpottersPosts(posts);
}

// ---------- showSpottersPosts / resetting posts grid container and propagating it anew ---------- \\
function showSpottersPosts(posts) {
  document.querySelector("#spotter-posts-container").innerHTML = "";
  for (const post of posts) {
    generatePost(post);
  }
}

// ---------- generatePost / generating a piece of html code to insert in posts grid container ---------- \\
function generatePost(postObject) {
  const htmlPost = /*html*/ `
                        <article id="article-mushroom-post">
                            <h2>${postObject.commonName}<h2>
                            <h3>${postObject.nameLatin}</h3>
                            <img src=${postObject.image} id="grid-img">
                            <p>${postObject.areaFound}</p>
                            <button class="btn-update">Update</button>
                            <button class="btn-delete">Delete</button>
                        </article>
    `;

  document.querySelector("#spotter-posts-container").insertAdjacentHTML("beforeend", htmlPost);

  // ---------- Eventlisteners on child elements---------- \\
  document.querySelector("#spotter-posts-container article:last-child").addEventListener("click", showDetails);

  document.querySelector("#spotter-posts-container article:last-child .btn-update").addEventListener("click", (event) => {
    event.stopPropagation();
    updatePostClicked();
  });
  document.querySelector("#spotter-posts-container article:last-child .btn-delete").addEventListener("click", (event) => {
    event.stopPropagation();
    deletePostClicked();
  });

  // ---------- showDetails / showing a dialog window showing data from the mushroom object clicked ---------- \\
  function showDetails() {
    //Resetting the 'confused with' section
    document.querySelector("#detail-confused-with").innerHTML = "";

    //Propagating textContent for detail view
    document.querySelector("#detail-common-name").textContent = postObject.commonName;
    document.querySelector("#detail-latin-name").textContent = postObject.nameLatin;
    document.querySelector("#detail-image").src = postObject.image;
    document.querySelector("#detail-description").textContent = postObject.description;
    document.querySelector("#detail-recognition").textContent = postObject.recognition;
    if (postObject.edible) {
      document.querySelector("#detail-edible").textContent = "Yes!";
    } else {
      document.querySelector("#detail-edible").textContent = "No!";
    }
    if (postObject.poisonous) {
      document.querySelector("#detail-poisonous").textContent = "Yes, do NOT eat!";
    } else if (!postObject.poisonous && !postObject.edible) {
      document.querySelector("#detail-poisonous").textContent = "No, safe to eat but not very tasty.";
    } else {
      document.querySelector("#detail-poisonous").textContent = "No, safe to eat.";
    }
    document.querySelector("#detail-season-from").textContent = postObject.seasonStart;
    document.querySelector("#detail-season-to").textContent = postObject.seasonEnd;

    for (let i = 0; i < postObject.confusedWith.length; i++) {
      const htmlElement = /*html*/ `
                    <li>${postObject.confusedWith[i]}</li>
      `;

      const htmlNoElements = /*html*/ `
                    <li>There are no known mushrooms that look like ${postObject.commonName}</li>
      `;

      if (postObject.confusedWith[0] === "none") {
        document.querySelector("#detail-confused-with").insertAdjacentHTML("beforeend", htmlNoElements);
      } else {
        document.querySelector("#detail-confused-with").insertAdjacentHTML("beforeend", htmlElement);
      }
    }

    document.querySelector("#detail-area-spotted").textContent = postObject.areaFound;

    //to-do implement google mini map image somehow?
    document.querySelector("#detail-area-url").href = postObject.map;

    document.querySelector("#detail-spotter").textContent = getSpotterName();

    document.querySelector("#date-spotted").textContent = postObject.dateSpotted;

    document.querySelector("#dialog-x-close").addEventListener("click", closeDetailView);
    document.querySelector("#dialog-detail-view").showModal();
  }

  // ---------- updatePostClicked / showing a dialog window with form filled with data from the mushroom object clicked ---------- \\
  function updatePostClicked() {
    document.querySelector("#dialog-update-x-close").addEventListener("click", cancelUpdate);

    //form shorthand
    const updateForm = document.querySelector("#update-mushroom-form");

    //propagating inputs
    updateForm.commonName.value = postObject.commonName;
    updateForm.nameLatin.value = postObject.nameLatin;
    updateForm.image.value = postObject.image;
    updateForm.map.value = postObject.map;
    updateForm.areaFound.value = postObject.areaFound;
    updateForm.description.value = postObject.description;
    updateForm.recognition.value = postObject.recognition;
    updateForm.edible.checked = postObject.edible;
    updateForm.poisonous.checked = postObject.poisonous;
    updateForm.seasonStart.value = postObject.seasonStart;
    updateForm.seasonEnd.value = postObject.seasonEnd;
    updateForm.confusedWith.value = postObject.confusedWith;
    updateForm.spotter.value = postObject.spotter; //to-do; needs to refer to spotter name or id
    updateForm.dateSpotted.value = postObject.dateSpotted;

    //setting the current postObjects id to the form
    updateForm.setAttribute("data-id", postObject.id);

    //show update dialog
    document.querySelector("#dialog-update").showModal();
  }

  // ---------- deletePostClicked / showing a dialog window with form filled with data from the mushroom object clicked ---------- \\
  function deletePostClicked() {
    document.querySelector("#common-name-to-delete").textContent = postObject.commonName;
    document.querySelector("#delete-post-form").setAttribute("data-id", postObject.id);
    document.querySelector("#dialog-delete").showModal();
  }

  function getSpotterName() {
    let spotterId = postObject.spotter;

    return spotterId;
  }
}
//generatePost codeblock end

// ---------- showCreateClicked / showing a form with empty data inputs corresponding to a mushroom object ---------- \\
function showCreateClicked(event) {
  event.preventDefault();
  console.log("%cCreate clicked", "color: green;font-size: 1.5rem");
  document.querySelector("#dialog-create").showModal();
  document.querySelector("#dialog-create-x-close").addEventListener("click", cancelCreate);
}

// ---------- createFormClicked / sending the propagated data to creatPostObject, creating a response and updating grid ---------- \\
async function createFormClicked(event) {
  console.log("%cCreate form clicked", "color: green;font-size: 1.5rem");
  event.preventDefault();
  const form = event.target;

  const commonName = form.commonName.value;
  const nameLatin = form.nameLatin.value;
  const image = form.image.value;
  const map = form.map.value;
  const areaFound = form.areaFound.value;
  const description = form.description.value;
  const recognition = form.recognition.value;
  const edible = form.edible.checked;
  const poisonous = form.poisonous.checked;
  const seasonStart = form.seasonStart.value;
  const seasonEnd = form.seasonEnd.value;
  const confusedWith = confusedWithArr();

  function confusedWithArr() {
    let arr = [];
    const str = form.confusedWith.value;

    arr = str.split(", ");

    return arr;
  }

  const spotter = form.spotter.value;
  const dateSpotted = form.dateSpotted.value;

  console.log("variables should be set?");

  const response = await creatPostObject(
    commonName,
    nameLatin,
    image,
    map,
    areaFound,
    description,
    recognition,
    edible,
    poisonous,
    seasonStart,
    seasonEnd,
    confusedWith,
    spotter,
    dateSpotted
  );

  console.log(response);

  if (response.ok) {
    console.log("%cResponse: 200(ok)", "color: green;font-size: 1.5rem");
    console.log("%cCreate succes!", "color: green;font-size: 1.5rem");
    updateGrid();
  } else {
    console.log("create failed");
    //to-do: make error message
  }

  document.querySelector("#dialog-create").close();
}

// ---------- cancelCreate / closes the create dialog window ---------- \\
function cancelCreate() {
  document.querySelector("#dialog-create").close();
}

// ---------- closeDetailView / closes the detail dialog window ---------- \\
function closeDetailView() {
  document.querySelector("#dialog-detail-view").close();
}

// ---------- updateClicked / sending the propagated data to updatePostObject, creating a response and updating grid ---------- \\
async function updateClicked(event) {
  console.log("update post was clicked");
  //form shorthand
  const form = event.target;

  const commonName = form.commonName.value;
  const nameLatin = form.nameLatin.value;
  const image = form.image.value;
  const map = form.map.value;
  const areaFound = form.areaFound.value;
  const description = form.description.value;
  const recognition = form.recognition.value;
  const edible = form.edible.checked;
  const poisonous = form.poisonous.checked;
  const seasonStart = form.seasonStart.value;
  const seasonEnd = form.seasonEnd.value;
  const confusedWith = confusedWithArr();

  function confusedWithArr() {
    let arr = [];
    const str = form.confusedWith.value;

    arr = str.split(", ");

    return arr;
  }

  const spotter = form.spotter.value;
  const dateSpotted = form.dateSpotted.value;

  const id = form.getAttribute("data-id");

  const response = await updatePostObject(
    id,
    commonName,
    nameLatin,
    image,
    map,
    areaFound,
    description,
    recognition,
    edible,
    poisonous,
    seasonStart,
    seasonEnd,
    confusedWith,
    spotter,
    dateSpotted
  );

  if (response.ok) {
    console.log("update succes!");
    updateGrid();
  } else {
    console.log("update failed");
    //to-do: make error message
  }
}

// ---------- cancelUpdate / closes the update dialog window ---------- \\
function cancelUpdate() {
  console.log("update canceled!");
  document.querySelector("#dialog-update").close();
}

// ---------- cancelDelete / closes the delete dialog window ---------- \\
function cancelDelete() {
  console.log("delete canceled!");
  document.querySelector("#dialog-delete").close();
}

// ---------- executeDelete / sending the data-id to deletePost, creating response and updating the grid---------- \\
async function executeDelete(event) {
  console.log("executeDelete called!");
  const id = event.target.getAttribute("data-id");
  const response = await deletePost(id);

  if (response.ok) {
    console.log("mushroom post deleted");
    updateGrid();
  }
}

// ---------- inputSearchChanged / passes the search value to postSearch and calls showSpottersPosts with search results---------- \\
function inputSearchChanged() {
  const value = this.value;
  const postsSearched = postSearch(value);

  showSpottersPosts(postsSearched);
}

// ---------- postSearch / searches for post with correlation between commonName/nameLatin and the search value---------- \\
function postSearch(value) {
  value = value.toLowerCase();

  const searchResult = posts.filter(checkMushroomName);

  function checkMushroomName(post) {
    const commonName = post.commonName.toLowerCase() + post.nameLatin.toLowerCase();

    return commonName.includes(value);
  }

  return searchResult;
}

function sortBy(event) {
  const value = event.target.value;
  console.log(`sorting was changed to ${value}`);

  if (value === "none") {
    updateGrid();
  } else if (value === "common-name") {
    posts.sort((post1, post2) => post1.commonName.localeCompare(post2.commonName));
    showSpottersPosts(posts);
  } else if (value === "latin-name") {
    posts.sort((post1, post2) => post1.nameLatin.localeCompare(post2.nameLatin));
    showSpottersPosts(posts);
  } else if (value === "date-spotted") {
    console.log("date spotted is not yet a property of posts");
  }
}

// ---------- filterPosts / checks if filter inputs are checked and  sets postsFiltered to a filtered list ---------- \\
function filterPosts() {
  console.log("A filter was checked/unchecked...");
  const edible = document.querySelector("#edible");
  const poisonous = document.querySelector("#poisonous");
  const recentWeek = document.querySelector("#recentWeek");

  if (edible.checked || poisonous.checked || recentWeek.checked) {
    postsFiltered = posts.filter(checkFilters);
    showSpottersPosts(postsFiltered);
  } else {
    showSpottersPosts(posts);
  }

  function checkFilters(post) {
    //date variables
    let postDateObject = new Date(post.dateSpotted) - 0; //post date is converted to milliseconds since new years 1970
    let weekAgo = new Date() - 604800000; //now - a week in milliseconds

    // 1 checked
    if (edible.checked && post.edible && !poisonous.checked && !recentWeek.checked) {
      return post;
    } else if (poisonous.checked && post.poisonous && !edible.checked && !recentWeek.checked) {
      return post;
    } else if (recentWeek.checked && postDateObject > weekAgo && !poisonous.checked && !edible.checked) {
      return post;
    }
    // 2 checked
    else if (recentWeek.checked && postDateObject > weekAgo && poisonous.checked && post.poisonous && !edible.checked) {
      return post;
    } else if (recentWeek.checked && postDateObject > weekAgo && !poisonous.checked && edible.checked && post.edible) {
      return post;
    } else if (!recentWeek.checked && postDateObject > weekAgo && poisonous.checked && post.poisonous && edible.checked && post.edible) {
      return post;
    }
    // 3 checked
    else if (recentWeek.checked && postDateObject > weekAgo && poisonous.checked && post.poisonous && edible.checked && post.edible) {
      return post;
    }
  }
}
