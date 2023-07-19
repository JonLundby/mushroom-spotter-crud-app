"use strict";

import { getposts, getSpotters, deletePost, updatePostObject } from "./rest.js";

let posts;
let spotters;

window.addEventListener("load", startApp);

// ---------- startApp / initial start function ---------- \\
async function startApp() {
  //updating the posts grid
  updateGrid();

  // ---------- Eventlisteners ---------- \\
  //create
  document.querySelector("#create-btn-main").addEventListener("click", createClicked);

  //update
  document.querySelector("#update-mushroom-form").addEventListener("submit", updateClicked);
  document.querySelector("#update-mushroom-form .btn-cancel").addEventListener("click", cancelUpdate);

  //delete
  document.querySelector("#delete-post-form .btn-cancel").addEventListener("click", cancelDelete);
  document.querySelector("#delete-post-form").addEventListener("submit", executeDelete);
}

// ---------- updateGrid / updating the posts grid ---------- \\
async function updateGrid() {
  posts = await getposts();
  spotters = await getSpotters();
  console.log(posts);
  console.log(spotters);

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
                            <img src=${postObject.image}>
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
      document.querySelector("#detail-poisonous").textContent = "Yes, do not eat!";
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

    // link to google maps image somehow???
    // document.querySelector("#detail-area-url").src = postObject.map;

    document.querySelector("#dialog-x-close").addEventListener("click", closeDetailView);
    document.querySelector("#dialog-detail-view").showModal();
  }

  function updatePostClicked() {
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

    //setting the current postObjects id to the form
    updateForm.setAttribute("data-id", postObject.id);

    //show update dialog
    document.querySelector("#dialog-update").showModal();
  }

  function deletePostClicked() {
    document.querySelector("#common-name-to-delete").textContent = postObject.commonName;
    document.querySelector("#delete-post-form").setAttribute("data-id", postObject.id);
    document.querySelector("#dialog-delete").showModal();
  }
}
//generatePost codeblock end

function createClicked() {
  console.log("createClicked!");

  document.querySelector("#dialog-create").showModal();
}

function closeDetailView() {
  document.querySelector("#dialog-detail-view").close();
}

async function updateClicked(event) {
  console.log("update post was clicked");
  //form shorthand
  const form = event.target;

  const commonName = form.commonName.value; //WORKING
  const nameLatin = form.nameLatin.value; //WORKING
  const image = form.image.value; //WORKING
  const map = form.map.value; //to-do; should work but propagating is not working...
  const areaFound = form.areaFound.value; //WORKING
  const description = form.description.value; //WORKING
  const recognition = form.recognition.value; //WORKING
  const edible = form.edible.checked; //WORKING
  const poisonous = form.poisonous.checked; //WORKING
  const seasonStart = form.seasonStart.value; //WORKING
  const seasonEnd = form.seasonEnd.value; //WORKING
  const confusedWith = confusedWithArr(); ////WORKING (to-do; optimate for spelling errors)

  function confusedWithArr() {
    let arr = [];
    const str = form.confusedWith.value;

    arr = str.split(", ");

    return arr;
  }

  const spotter = form.spotter.value;

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
    spotter
  );

  if (response.ok) {
    console.log("update succes!");
    updateGrid();
  } else {
    console.log("update failed");
    //to-do: make error message
  }
}

function cancelUpdate() {
  console.log("update canceled!");
  document.querySelector("#dialog-update").close();
}

function cancelDelete() {
  console.log("delete canceled!");
  document.querySelector("#dialog-delete").close();
}

async function executeDelete(event) {
  console.log("executeDelete called!");
  const id = event.target.getAttribute("data-id");
  const response = await deletePost(id);

  if (response.ok) {
    console.log("mushroom post deleted");
    updateGrid();
  }
}
