//URL variable reference to database
const endpoint = "https://mushroom-spotter-data-default-rtdb.europe-west1.firebasedatabase.app/";

// ----------getPosts / fetching the endpoint json data for posts ---------- \\
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

// ---------- preparePosts / Pushes each data key into new posts array and adds .id property to each object  ---------- \\
function preparePosts(data) {
  const postsArr = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const post = data[key];
      post.id = key;
      postsArr.push(post);
    }
  }
  // console.log(postsArr);
  return postsArr;
}

// ---------- getSpotters / fetching the endpoint json data for spotters---------- \\
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
      spotter.id = key;
      spottersArr.push(spotter);
    }
  }
  // console.log(postsArr);
  return spottersArr;
}

// ---------- creatPostObject / creating(posting) post into the endpoint data---------- \\
async function creatPostObject(
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
) {
  const postObjectToCreate = {
    commonName: commonName,
    nameLatin: nameLatin,
    image: image,
    map: map,
    areaFound: areaFound,
    description: description,
    recognition: recognition,
    edible: Boolean(edible),
    poisonous: Boolean(poisonous),
    seasonStart: seasonStart,
    seasonEnd: seasonEnd,
    confusedWith: confusedWith,
    spotter: spotter,
    dateSpotted: dateSpotted,
  };

  const json = JSON.stringify(postObjectToCreate);
  const response = await fetch(`${endpoint}/post.json`, { method: "POST", body: json });

  console.log(response);

  return response;
}

// ---------- updatePostObject / updating(putting) post in the endpoint data---------- \\
async function updatePostObject(
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
) {
  const postObjectToUpdate = {
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
    dateSpotted,
  };

  const json = JSON.stringify(postObjectToUpdate);
  const response = await fetch(`${endpoint}/post/${id}.json`, { method: "PUT", body: json });
  return response;
}

// ---------- deletePost / Deletes post from database ---------- \\
async function deletePost(id) {
  const response = await fetch(`${endpoint}/post/${id}.json`, { method: "DELETE" });
  return response;
}

export { getposts, getSpotters, deletePost, creatPostObject, updatePostObject };
