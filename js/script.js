"use strict";

import { getposts, getSpotters, deletePost } from "./rest.js";

let posts;
let spotters;

window.addEventListener("load", startApp);

// ----------startApp / initial start function ---------- \\
async function startApp() {
  //updating the posts grid
  updateGrid();

  // ----------Eventlisteners ---------- \\
  document.querySelector("#delete-post-form .btn-cancel").addEventListener("click", cancelDelete);
  document.querySelector("#delete-post-form").addEventListener("submit", executeDelete);
}

// ----------updateGrid / updating the posts grid ---------- \\
async function updateGrid() {
  posts = await getposts();
  spotters = await getSpotters();
  console.log(posts);
  console.log(spotters);
  
  showSpottersPosts(posts);
}

// ----------showSpottersPosts / resetting posts grid container and propagating it anew ---------- \\
function showSpottersPosts(posts) {
  document.querySelector("#spotter-posts-container").innerHTML = "";
  for (const post of posts) {
    generatePost(post);
  }
}

// ----------generatePost / generating a piece of html code to insert in posts grid container ---------- \\
function generatePost(postObject) {
  const htmlPost = /*html*/ `
  <article>
  <h2>${postObject.mushroomname}<h2>
                            <h3>${postObject.namelatin}</h3>
                            <img src=${postObject.image}>
                            <p>${postObject.areafound}</p>
                            <button class="btn-update">Update</button>
                            <button class="btn-delete">Delete</button>
                        </article>
    `;

  document.querySelector("#spotter-posts-container").insertAdjacentHTML("beforeend", htmlPost);

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
    document.querySelector("#detail-mushroom-name").textContent = postObject.mushroomname;
    document.querySelector("#detail-latin-name").textContent = postObject.namelatin;
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
    document.querySelector("#detail-season-from").textContent = postObject.seasonstart;
    document.querySelector("#detail-season-to").textContent = postObject.seasonend;

    for (let i = 0; i < postObject.confusedwith.length; i++) {
      const htmlElement = /*html*/ `
                    <li>${postObject.confusedwith[i]}</li>
      `;

      const htmlNoElements = /*html*/ `
                    <li>There are no known mushrooms that look like ${postObject.mushroomname}</li>
      `;

      if (postObject.confusedwith[0] === "none") {
        document.querySelector("#detail-confused-with").insertAdjacentHTML("beforeend", htmlNoElements);
      } else {
        document.querySelector("#detail-confused-with").insertAdjacentHTML("beforeend", htmlElement);
      }
    }

    document.querySelector("#detail-area-spotted").textContent = postObject.areafound;
    
    // link to google maps image somehow???
    // document.querySelector("#detail-area-url").src = postObject.map;

    document.querySelector("#dialog-x-close").addEventListener("click", closeDetailView);
    document.querySelector("#dialog-detail-view").showModal();
  }

  function updatePostClicked() {
    console.log("updateClicked");
    // to-do
  }

  function deletePostClicked() {
    document.querySelector("#mushroomname-to-delete").textContent = postObject.mushroomname;
    document.querySelector("#delete-post-form").setAttribute("data-id", postObject.id);
    document.querySelector("#dialog-delete").showModal();
  }
}

function closeDetailView() {
  document.querySelector("#dialog-detail-view").close();
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
