//Selectors
let characterContainer = document.querySelector("#character-container");
let addBtn = document.querySelector("#add-btn");
let addNewCharacterModal = document.getElementById("add-new-character-modal");
let saveCharacterBtn = document.querySelector("#save-character-btn");
let idInput = document.querySelector("#id-input");
let firstNameInput = document.querySelector("#first-name-input");
let lastNameInput = document.querySelector("#last-name-input");
let genderInput = document.querySelector("#gender-input");
let dateOfBirthInput = document.querySelector("#date-of-birth-input");
let bloodStatusInput = document.querySelector("#blood-status-input");
let houseInput = document.querySelector("#house-input");
let professionInput = document.querySelector("#profession-input");
let affiliationsInput = document.querySelector("#affiliations-input");
let closeModalBtn1 = document.querySelector("#close-modal-btn1");
let closeModalBtn2 = document.querySelector("#close-modal-btn2");

//Get data
fetch("https://localhost:7251/v1/Users").then((response) =>
  response.json().then((data) => displayData(data))
);

//Event listeners
addBtn.addEventListener("click", openAddNewCharacterModal);
saveCharacterBtn.addEventListener("click", addNewCharacter);
closeModalBtn1.addEventListener("click", closeAddNewCharacterModal);
closeModalBtn2.addEventListener("click", closeAddNewCharacterModal);

//Functions
function openAddNewCharacterModal() {
  addNewCharacterModal.style.display = "block";
}
function closeAddNewCharacterModal() {
  console.log("yiha!");
  addNewCharacterModal.style.display = "none";
}

function addNewCharacter() {
  let newCharacter = createCharacter();
  fetch("https://localhost:7251/v1/Users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCharacter),
  }).then((response) => {
    if (response.ok) {
      window.alert("Character was successfully added!");
      closeAddNewCharacterModal();
      getCharacters();
    } else {
      window.alert(`Something went wrong! Error code ${response.status}`);
    }
  });
}

function createCharacter() {
  let newCharacter = {
    id: Number(idInput.value),
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    fullName: firstNameInput.value + lastNameInput.value,
    gender: genderInput.value,
    birthDate: dateOfBirthInput.value,
    bloodStatus: bloodStatusInput.value,
    house: houseInput.value,
    profession: professionInput.value,
    affiliations: [affiliationsInput.value],
  };
  return newCharacter;
}

function displayData(characters) {
  //Start with clearing the page to handle toggling
  characterContainer.innerHTML = "";
  characters.forEach((c) => {
    let trimmedDateOfBirth = c.birthDate.substring(0, 10);
    characterContainer.innerHTML += `
        <div class="col-12 col-md-5 col-lg-4 col-xl-3 character-card">
            <h2 class="character-name">${c.fullName}</h2>
            <hr class="upper-line">
            <p class="d-flex justify-content-between">Gender: <span>${c.gender}</span></p>
            <hr>
            <p class="d-flex justify-content-between">Date of Birth: <span>${trimmedDateOfBirth}<span></p>
            <hr>
            <p class="d-flex justify-content-between">Blood status: <span>${c.bloodStatus}</span></p>
            <hr>
            <p class="d-flex justify-content-between">House: <span>${c.house}</span></p>
            <hr>
            <p class="d-flex justify-content-between">Profession: <span>${c.profession}</span></p>
            <hr>
            <p class="d-flex justify-content-between">Affiliations: <span>${c.affiliations[0]}</span></p>
            <hr>
            <div class="button-container d-flex justify-content-between">
                <button class="delete-btn" id="delete-btn-${c.id}" onclick="deleteCharacter(${c.id})">Delete character</button>
                <button class="save-btn" id="save-btn-${c.id}">Save changes</button>
                <button class="update-btn" id="update-btn-${c.id}">Update character</button>
            </div>

        </div>
        `;
  });
}

function getCharacters() {
  fetch("https://localhost:7251/v1/Users").then((response) =>
    response.json().then((data) => displayData(data))
  );
}

function deleteCharacter(characterId) {
  fetch(`https://localhost:7251/v1/Users/${characterId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (response.ok) {
      window.alert("Character was succesfully removed!");
      getCharacters();
    } else {
      window.alert("Character could not be removed!");
    }
  });
}
