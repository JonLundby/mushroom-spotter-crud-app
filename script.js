"use strict";

const endpoint = "https://mushroom-spotter-data-default-rtdb.europe-west1.firebasedatabase.app/";
let posts;

window.addEventListener("load", startApp);

async function startApp() {
  posts = await getposts();

  showSpottersPosts(posts);
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
                        </article>
    `;

  document.querySelector("#spotter-posts-container").insertAdjacentHTML("beforeend", htmlPost);
}
