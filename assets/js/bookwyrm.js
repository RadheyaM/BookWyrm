//_________________________GLOBAL CONSTANTS_______________________________________

const searchBar = document.getElementById("search");
const searchContainer = document.getElementsByClassName("search-container")[0];
const searchBtn = document.getElementById("search-btn");
const refreshBtn = document.getElementById("refresh");
const navBar = document.getElementsByClassName("navbar")[0];
const logo = document.getElementById("logo");
const pinnedCardContainer = document.getElementById("pinned-cards-container");
const pinnedCardTemplate = document.getElementById("pinned-card-template");
const pinIcon = document.getElementsByClassName("pin-icon")[0];
const cardContainer = document.getElementById("book-cards-container");
const cardTemplate = document.getElementById("book-card-template");
const openPopupButtons = document.querySelectorAll("[data-popup-target]");
const closePopupButtons = document.querySelectorAll("[data-close-button]");
const popupOverlay = document.getElementById("popup-bg");
const popUp = document.getElementById("popup");
const popUpHeader = document.getElementsByClassName("popup-header")[0];
const popUpTitle = document.getElementsByClassName("pop-title")[0];
const popUpSubHeader = document.getElementsByClassName("popup-subheader")[0];
const popUpImage= document.getElementsByClassName("pop-image")[0];
const popUpDetails = document.getElementsByClassName("pop-details")[0];
const popUpAuth = document.getElementById("author");
const popUpPublished = document.getElementById("published");
const popUpPublisher = document.getElementById("publisher");
const popUpPrint = document.getElementById("print-type");
const popUpBody = document.getElementsByClassName("popup-body")[0];
const popUpDesc = document.getElementsByClassName("pop-desc")[0];
const popUpBookId = document.getElementsByClassName("pop-book-id")[0];
const popUpButtonsCont = document.getElementsByClassName("popup-button")[0];
const popBooklistBtn = document.getElementById("save-to-booklist");
const popPinBtn = document.getElementById("pin");
const popGoogleBtn = document.getElementById("google");

//_____________________________ EVENT LISTENERS__________________________________________

// on initial load
window.addEventListener("load", () => {
  //LastSearch is for populating popups on card click after a search
  writeData("LastSearch", []);
  //generate storage arrays if they do not already exist
  const storageKeys = ["History", "BookList", "BookListTitles", "PinList", "PinListTitles"]
  for (let i = 0; i < storageKeys.length; i++) {
    if (readData(storageKeys[i]) === null) {
      writeData(storageKeys[i], []);
    }
  }
  populateDropdown("History", "History", "history-dropdown");
  populateDropdown("BookListTitles", "BookList", "booklist-dropdown");
});

//Peform the search
searchBtn.addEventListener("click", () => {
  //hide any pinned cards
  const searchBarInput = document.getElementById("search").value;
  //Query google books with user search
  performApiQuery(searchBarInput);
  //save history
  saveSearchHistory(searchBarInput);
  //console.log(readData("LastSearch"));
  // //generate cards to display search results
  // generateCards("History", cardContainer);
})

searchBar.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
//refresh button reloads the page
refreshBtn.addEventListener("click", () => {
    location.reload();
})

closePopupButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.closest(".popup"); //checks for the closest parent of a button element with class popup
    closePopUp(target);
  })
})

//clicking To Booklist button on popup window saves that book to BookList
popBooklistBtn.addEventListener("click", e => {
  //change button style on click
  e.path[0].classList.add("saved");
  e.path[0].innerHTML = '<i class="fa-solid fa-circle-check"></i> Booklist';
  //save
  saveToList("BookList", "BookListTitles");
})

//same as above except for pin button and list
popPinBtn.addEventListener("click", e => {
  e.path[0].classList.add("saved");
  e.path[0].innerHTML = '<i class="fa-solid fa-circle-check"></i> Pinned!';
  saveToList("PinList", "PinListTitles");
})
//_________________________________FUNCTION DECLARATIONS___________________________________________//

//perform the query and save the data to local storage
async function performApiQuery (userInput) {
  const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${userInput}&maxResults=40&langRestrict=en`);
  console.log(endpoint);
  const response = await fetch(endpoint);
  const data = await response.json();
  //console.log(data.items);
  //commit the search results to local storage
  let searchItems = [];
  for (let i = 0; i < data.items.length; i++) {
    searchItems.push(data.items[i].volumeInfo);
  }
  console.log(searchItems);
  writeData("LastSearch", searchItems);
  generateCards(searchItems, cardContainer, cardTemplate)
}
//cards displaying search results
function generateCards (key, container, template) {
  const bookList = key;
  const imageList = generateImageList(bookList);
  for (let i = 0; i < key.length; i++) {
    const cloneCard = template.content.cloneNode(true).children[0];
    const cardImage = cloneCard.querySelectorAll(".image")[0];
    const cardTitle = cloneCard.querySelectorAll(".book-title")[0];
    const cardAuthor = cloneCard.querySelectorAll(".book-auth")[0];
    cardImage.style.background = `url(${imageList[i]}) no-repeat center center`;
    cardTitle.textContent = bookList[i].title;
    cardAuthor.textContent = bookList[i].authors;
    cloneCard.dataset.volumeId = [i]; //so book can be found in local storage
    cloneCard.dataset.array = "LastSearch";
    container.append(cloneCard);
    //add event listener to open popup
    let bookCards = document.querySelectorAll(".card");
    //Generate event listeners on each card
    bookCards.forEach(card => {
      card.addEventListener("click", openPopUp);
    })
  }
}
//identifies the bookobject from card clicked and opens popup
function openPopUp (target) {
  if (target == null) return
  const path = target.path.reverse();
  const volumeId = path[5].dataset.volumeId;
  const arrayId = path[5].dataset.array;
  const storageArray = readData(arrayId);
  console.log(`volumeID = ${volumeId}`)
  const volumeInfo = storageArray[volumeId];

  populatePopUp(volumeInfo, arrayId, volumeId);

  popUp.classList.add("active");
  popupOverlay.classList.add("active");
}

function populatePopUp (volumeInfo, arrayId, volumeId) {
  popUpTitle.textContent = volumeInfo.title;
  popUpDesc.textContent = volumeInfo.description
  popUpImage.style.background = `url(${volumeInfo.imageLinks.thumbnail}) no-repeat center center`;
  popUpAuth.textContent = `Author:  ${volumeInfo.authors}`;
  popUpPublished.textContent = `Published By:  ${volumeInfo.publishedDate}`;
  popUpPublisher.textContent = `Published By:  ${volumeInfo.publisher}`;
  popUpPrint.textContent = `Print Type:  ${volumeInfo.printType}`;
  popUp.dataset.volumeId = volumeId //COULD BE IMPORTANT TO CHANGE THIS LATER!
  popUp.dataset.arrayId = arrayId; // ID the correct storage array
}

//removes popup window
function closePopUp (target) {
  popUp.classList.remove("active");
  popupOverlay.classList.remove("active");
}

//read data in local storage array
function readData (key) {
  return JSON.parse(localStorage.getItem(key))
}
//write data to local storage
function writeData (key, data) {
  return localStorage.setItem(key, JSON.stringify(data))
}

//generate a list of image source pathways from API response data
function generateImageList(data) {
  let imageUrls = [];
  for (let i = 0; i < data.length; i++) {
    //prevent uncaught type-error due to missing image url
    if (data[i].imageLinks !== undefined) {
      imageUrls.push(data[i].imageLinks.thumbnail);
    }
    //add a placeholder if needed
    else {
      imageUrls.push("assets/images/bookcover-placeholder.jpg");
    }
  }
  return imageUrls;
}
//save the search term 
function saveSearchHistory (userInput) {
  let history = readData("History");
  history.push(userInput);
  console.log(history);
  writeData("History", history);
}

//can use for multiple lists 
function saveToList (key, key2) {
  //list to be saved to
  const list = readData(key);
  //list of titles saved in the list
  const listTitles = readData(key2);
  //id of the volume currently displayed on open popup
  const volumeId = popUp.dataset.volumeId;
  //id of the storage array populating the open popup
  const arrayId = popUp.dataset.arrayId;
  //should get the book object currently being displayed
  let sourceArray = readData(arrayId);

  //prevent duplicates
  for (let i = 0; i < listTitles.length; i++) {
    if (listTitles[i] === sourceArray[volumeId].title) return
  }
  //save displayed book object to new appropriate list
  list.push(sourceArray[volumeId]);
  writeData(key, list);
  listTitles.push(sourceArray[volumeId].title);
  writeData(key2, listTitles);
}

function populateDropdown (key, key2, dropdownName) {
  const titlesArray = readData(key);
  const objectArray = readData(key2);
  const menuDropdown = document.getElementById(dropdownName);
  //generate the links and populate
  for (let i = 0; i < titlesArray.length; i++) {
    let newA = document.createElement("a");
    newA.innerHTML = titlesArray[i];
    newA.setAttribute("data-id", i);
    menuDropdown.appendChild(newA);
    //add event listeners to each new link added
    let newDropdownItem = menuDropdown.getElementsByTagName("a")[i];
    // initiates eventAction upon clicking a dropdown link
    if (dropdownName === "history-dropdown") {
      newDropdownItem.addEventListener("click", e => {
        searchBar.value = e.path[0].innerHTML;
        searchBtn.click()
      })
    }
    else {
      newDropdownItem.addEventListener("click", e => {
        const volumeId = e.path[0].getAttribute("data-id");
        const volumeInfo = objectArray[volumeId];
        populatePopUp(volumeInfo, key, volumeId);
        popUp.classList.add("active");
        popupOverlay.classList.add("active");
      });
    }
  }
}