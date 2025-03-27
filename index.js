let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  fetchToys(); // Load toys when the page loads
  setupFormListener(); // Handle new toy submissions
});

// Fetch all toys and render them
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => renderToy(toy));
    });
}

// Create and display toy card
function renderToy(toy) {
  const toyCollection = document.querySelector("#toy-collection");

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar"/>
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Add like button functionality
  card.querySelector(".like-btn").addEventListener("click", () => increaseLikes(toy, card));

  toyCollection.appendChild(card);
}

// Setup form submission event
function setupFormListener() {
  document.querySelector(".add-toy-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = event.target.name.value;
    const image = event.target.image.value;

    const newToy = { name, image, likes: 0 };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy); // Add new toy to the DOM
      event.target.reset(); // Clear the form
    });
  });
}

// Increase toy likes
function increaseLikes(toy, card) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
    toy.likes = updatedToy.likes; // Update local toy object
    card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
  });
}
