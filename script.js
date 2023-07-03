"use strict";

const endpoint = "https://mushroom-spotter-data-default-rtdb.europe-west1.firebasedatabase.app/";
let posts;

window.addEventListener("load", startApp);

async function startApp() {
  //updating the posts grid
  updatePostGrid();

  //Eventlisteners
  document.querySelector("#delete-post-form .btn-cancel").addEventListener("click", cancelDelete);
  document.querySelector("#delete-post-form").addEventListener("submit", executeDelete);

}

async function getposts() {
  const response = await fetch(`${endpoint}/post.json`);
  const data = await response.json();
  if (typeof data === "object" && data !== null) {
    const posts = preparePosts(data);
    return posts;
  } else {
    throw new Error("Invalid, data should be an object");
  }
}

function preparePosts(data) {
  const postsArr = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const post = data[key];
      post.id = key;
      postsArr.push(post);
    }
  }
  return postsArr;
}

async function updatePostGrid() {
  posts = await getposts();

  showSpottersPosts(posts);
}

function showSpottersPosts(posts) {
  document.querySelector("#spotter-posts-container").innerHTML = "";
  for (const post of posts) {
    generatePost(post);
  }
}

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
  
  document.querySelector("#spotter-posts-container article:last-child").addEventListener("click", showDetails)

  document.querySelector("#spotter-posts-container article:last-child .btn-update").addEventListener("click", event => {
    event.stopPropagation();
    updatePostClicked();
  })
  document.querySelector("#spotter-posts-container article:last-child .btn-delete").addEventListener("click", event => {
    event.stopPropagation();
    deletePostClicked();
  })

  function showDetails() {
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

      document.querySelector("#detail-confused-with").insertAdjacentHTML("beforeend", htmlElement);
    }
  
    document.querySelector("#dialog-detail-view").showModal();
  }
  // function detailsClicked(postObject) {
  //   console.log("calling showDetails...")
  //   showDetails(postObject);
  // }
  
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


function cancelDelete() {
  console.log("delete canceled!")
  document.querySelector("#dialog-delete").close();
}

async function executeDelete(event) {
  console.log("executeDelete called!")
  const id = event.target.getAttribute("data-id");
  const response = await deletePost(id);

  if (response.ok) {
    console.log("mushroom post deleted")
    updatePostGrid();
  }
}

async function deletePost(id) {
  const response = await fetch(`${endpoint}/post/${id}.json`, { method: "DELETE" });
  console.log(response)
  return response;
}