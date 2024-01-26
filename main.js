//Selectors
let characterContainer = document.querySelector("#character-container");
let addBtn = document.querySelector("#add-btn");
let addNewCharacterModal = document.getElementById("add-new-character-modal");
let saveCharacterBtn = document.querySelector("#save-character-btn");
let addAffiliationsBtnClickOnUpdate = 0;

//Selectors from modal
let idInput = document.querySelector("#id-input");
let imageUrlInput = document.querySelector("#image-url-input");
let firstNameInput = document.querySelector("#first-name-input");
let lastNameInput = document.querySelector("#last-name-input");
let genderInput = document.querySelector("#gender-input");
let dateOfBirthInput = document.querySelector("#date-of-birth-input");
let bloodStatusInput = document.querySelector("#blood-status-input");
let houseInput = document.querySelector("#house-input");
let professionInput = document.querySelector("#profession-input");
let closeModalBtn1 = document.querySelector("#close-modal-btn1");
let closeModalBtn2 = document.querySelector("#close-modal-btn2");
let addAffiliationBtn = document.querySelector("#add-affiliation-btn");
let affiliationsContainer = document.querySelector("#affiliations-container");
let addAffiliationsBtnClick = 0;
let searchBox = document.querySelector("#search-characters-input");

//Get data
getCharacters();

//Event listeners
addBtn.addEventListener("click", openAddNewCharacterModal);
saveCharacterBtn.addEventListener("click", addNewCharacter);
closeModalBtn1.addEventListener("click", closeAddNewCharacterModal);
closeModalBtn2.addEventListener("click", closeAddNewCharacterModal);
addAffiliationBtn.addEventListener("click", addNewAffiliationInput);
searchBox.addEventListener("input", searchCharacters);

//Functions

//Search users
async function searchCharacters() {
  let searchValue = searchBox.value;
  let response = await fetch("https://localhost:7251/v1/Users");
  let allCharacters = await response.json();
  let charactersToDisplay = [];
  allCharacters.forEach((c) => {
    if (c.fullName.toUpperCase().includes(searchValue.toUpperCase())) {
      charactersToDisplay.push(c);
    }
  });
  displayData(charactersToDisplay);
}

//Add new input field for affiliation when in the modal
function addNewAffiliationInput() {
  addAffiliationsBtnClick++;
  affiliationsContainer.innerHTML += `
  <p<input id="affiliations-input-${addAffiliationsBtnClick}" type="text" />
  `;
}

//Open modal for adding new character
function openAddNewCharacterModal() {
  addNewCharacterModal.style.display = "block";
}

//Close modal for adding new character
function closeAddNewCharacterModal() {
  addNewCharacterModal.style.display = "none";
  restoreModal();
}

//Clear all entered values in modal
function restoreModal() {
  idInput.value = "";
  genderInput.value = "";
  imageUrlInput.value = "";
  firstNameInput.value = "";
  lastNameInput.value = "";
  dateOfBirthInput.value = "";
  bloodStatusInput.value = "";
  houseInput.value = "";
  professionInput.value = "";
  affiliationsContainer.innerHTML = `
    <label for="affiliations-input-0">Affiliations</label>
    <input id="affiliations-input-0" type="text" />`;
}

//Add new character to 'database'
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

//Create an object-character
function createCharacter() {
  //Create an array of affiliations from the user input-fields from the container.
  let affiliationsInputs = Array.from(
    document
      .getElementById("affiliations-container")
      .getElementsByTagName("input")
  );
  let characterAffiliations = [];
  //If the text field is empty, ignore
  affiliationsInputs.forEach((a) => {
    if (a.value != "") {
      characterAffiliations.push(a.value);
    }
  });
  let newCharacter = {
    id: Number(idInput.value),
    img: imageUrlInput.value,
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    fullName: firstNameInput.value + lastNameInput.value,
    gender: genderInput.value,
    birthDate: dateOfBirthInput.value,
    bloodStatus: bloodStatusInput.value,
    house: houseInput.value,
    profession: professionInput.value,
    affiliations: characterAffiliations,
  };
  return newCharacter;
}

//Create HTML in container to display character-info.
//Add buttons to handle delete, update and saving changes.
//TODO: Handle multiple affiliations and present them in a nice way
function displayData(characters) {
  //Start with clearing the page to handle when page is reloaded after updates, adding and deleting of characters.
  characterContainer.innerHTML = "";
  characters.forEach((c) => {
    let trimmedDateOfBirth = c.birthDate.substring(0, 10);
    characterContainer.innerHTML += `
        <div class="col-10 col-md-5 col-lg-4 col-xl-3 character-card">
        <h2 class="d-flex justify-content-center">${c.fullName}</h2>
        <div class="image-container">
           <img class="character-image" src="${c.img}" alt="${c.fullName}-picture">
        </div>
            <hr class="upper-line">
            <p class="d-flex justify-content-between">Gender: <input id="gender-input-${c.id}" class="input-character-card" readonly="true" value="${c.gender}"></input></p>
            <hr>
            <p class="d-flex justify-content-between">Date of Birth: <input id="date-of-birth-input-${c.id}" type="date" class="input-character-card" readonly="true" value="${trimmedDateOfBirth}"></input></p>
            <hr>
            <p class="d-flex justify-content-between">Blood status: <input id="blood-status-input-${c.id}" class="input-character-card" readonly="true" value="${c.bloodStatus}"></input></p>
            <hr>
            <p class="d-flex justify-content-between">House: <input id="house-input-${c.id}" class="input-character-card" readonly="true" value="${c.house}"></input></p>
            <hr>
            <p class="d-flex justify-content-between">Profession: <input id="profession-input-${c.id}" class="input-character-card" readonly="true" value="${c.profession}"></input></p>
            <hr>
            <div id="affiliations-container-${c.id}">
            </div>
            <p class="d-flex justify-content-between" style="visibility: collapse">'<button id="add-affiliation-btn-${c.id}" class="add-affiliation-btn-style" onclick="addNewAffiliationsInput(${c.id})">+ Add affiliation</button></p>
            <hr>
            <div class="button-container d-flex justify-content-between">
                <button class="delete-btn" id="delete-btn-${c.id}" onclick="deleteCharacter(${c.id})">Delete character</button>
                <button class="save-btn" id="save-btn-${c.id}" onclick="updateCharacter(${c.id})">Save changes </button>
                <button class="update-btn" id="update-btn-${c.id}" onclick="unlockInputFields(${c.id})">Update character</button>
            </div>

        </div>
        `;
    let affiliationsContainer = document.querySelector(
      `#affiliations-container-${c.id}`
    );
    let count = 0;
    c.affiliations.forEach((a) => {
      if (count < 1) {
        affiliationsContainer.innerHTML += `
        <p class="d-flex justify-content-between">Affiliations:<input id="affiliations-input-${c.id}-${count}" class="input-character-card" readonly="true" value="${a}"></p>
        `;
      } else {
        affiliationsContainer.innerHTML += `
          <p class="d-flex justify-content-between">'<input id="affiliations-input-${c.id}-${count}" class="input-character-card" readonly="true" value="${a}"></input></p>
          `;
      }
      count++;
    });
  });
}

//Get all characters from 'database'
function getCharacters() {
  fetch("https://localhost:7251/v1/Users").then((response) =>
    response.json().then((data) => displayData(data))
  );
}

//Function for adding new affiliations input fields on editing character card.
function addNewAffiliationsInput(characterId) {
  addAffiliationsBtnClickOnUpdate++;
  let currentUserAffiliationsContainer = document.getElementById(
    `affiliations-container-${characterId}`
  );
  currentUserAffiliationsContainer.innerHTML += `
  <p class="d-flex justify-content-between">'<input id="affiliations-input-${addAffiliationsBtnClickOnUpdate}-update" class="input-character-card" type="text" /></p>
  `;
}

//Unlock all input fields upon editing character.
function unlockInputFields(characterId) {
  //Get all input fields in the whole container and make them editable.
  let inputFields = Array.from(
    document
      .getElementById(`update-btn-${characterId}`)
      .parentElement.parentElement.getElementsByTagName("input")
  );
  inputFields.forEach((i) => {
    i.readOnly = false;
  });

  //Hide button 'Save character'
  let clickedButton = document.getElementById(`update-btn-${characterId}`);
  clickedButton.style.visibility = "hidden";
  //Show button 'Save changes'
  let saveChangesButton = document.getElementById(`save-btn-${characterId}`);
  saveChangesButton.style.visibility = "visible";

  //Shot button 'Add affiliations'
  let addAffiliationsBtnOnUpdate = document.getElementById(
    `add-affiliation-btn-${characterId}`
  );
  addAffiliationsBtnOnUpdate.style.visibility = "visible";
}

//Update character by id
async function updateCharacter(characterId) {
  //Selectors
  let genderInput = document.querySelector(`#gender-input-${characterId}`);
  let dateOfBirthInput = document.querySelector(
    `#date-of-birth-input-${characterId}`
  );
  let bloodStatusInput = document.querySelector(
    `#blood-status-input-${characterId}`
  );
  let houseInput = document.querySelector(`#house-input-${characterId}`);
  let professionInput = document.querySelector(
    `#profession-input-${characterId}`
  );

  let affiliationsInputs = Array.from(
    document
      .getElementById(`affiliations-container-${characterId}`)
      .getElementsByTagName("input")
  );
  let characterAffiliations = [];
  affiliationsInputs.forEach((a) => {
    if (a.value != "") {
      characterAffiliations.push(a.value);
    }
  });

  //Get the character from 'db' so we can use it's information
  let response = await fetch(`https://localhost:7251/v1/Users/${characterId}`);
  let characterToUpdate = await response.json();

  //Create a new character and assign it's attributes.
  //The ones that are not changeable are assigned from the fetched user and the other are set from the input fields.
  let updatedCharacter = {
    id: characterToUpdate.id,
    firstName: characterToUpdate.firstName,
    lastName: characterToUpdate.lastName,
    fullName: characterToUpdate.fullName,
    img: characterToUpdate.img,
    gender: genderInput.value,
    birthDate: dateOfBirthInput.value,
    bloodStatus: bloodStatusInput.value,
    house: houseInput.value,
    profession: professionInput.value,
    affiliations: characterAffiliations,
  };
  //Update user in 'db'
  fetch(`https://localhost:7251/v1/Users/${characterId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCharacter),
  }).then((response) => {
    if (response.ok) {
      window.alert("Character was successfully updated!");
      //Reload characters
      getCharacters();
    } else {
      window.alert(`Something went wrong! Error code ${response.status}`);
    }
  });
}

//Delete character by id
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
