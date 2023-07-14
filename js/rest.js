//URL variable reference to database
const endpoint = "https://mushroom-spotter-data-default-rtdb.europe-west1.firebasedatabase.app/";

// ----------getPosts / fetching json data from firebase ---------- \\
async function getposts() {
  const response = await fetch(`${endpoint}/post.json`);
  const data = await response.json();
  //checking if data is object and preparing posts
  if (typeof data === "object" && data !== null) {
    const posts = preparePosts(data);
    return posts;
  } else {
    throw new Error("Invalid, data should be an object");
  }
}

// ---------- Pushes each data key into new posts array and adds .id property to each object  ---------- \\
function preparePosts(data) {
  const postsArr = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const post = data[key];
      post.id = key
      postsArr.push(post);
    }
  }
  // console.log(postsArr);
  return postsArr;
}

async function getSpotters() {
  const response = await fetch(`${endpoint}/spotter.json`);
  const data = await response.json();
  //checking if data is object and preparing posts
  if (typeof data === "object" && data !== null) {
    const spotters = prepareSpotters(data);
    return spotters;
  } else {
    throw new Error("Invalid, data should be an object");
  }
}

// ----------preparePosts / pushes each data key, as an object, into new posts array and adds .id property to each object  ---------- \\
function prepareSpotters(data) {
  const spottersArr = [];
  // console.log(data);
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const spotter = data[key];
      spotter.id = key
      spottersArr.push(spotter);
    }
  }
  // console.log(postsArr);
  return spottersArr;
}

// ---------- Updates post in database ---------- \\
async function updatePostObject(id, commonName, namelatin, image, map, areaFound, description, recognition, edible, poisonous, seasonStart, seasonEnd, confusedwith, spotter) {
  const postObjectToUpdate = {
    commonName,
    namelatin,
    image,
    map,
    areaFound,
    description,
    recognition,
    edible,
    poisonous,
    seasonStart,
    seasonEnd,
    confusedwith,
    spotter,
  };

  const json = JSON.stringify(postObjectToUpdate);
  const response = await fetch(`${endpoint}/post/${id}.json`, { method: "PUT", body: json });
  return response;
}

// ---------- Deletes post from database ---------- \\
async function deletePost(id) {
  const response = await fetch(`${endpoint}/post/${id}.json`, { method: "DELETE" });
  return response;
}

export { getposts, getSpotters, deletePost, updatePostObject };
