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
  if (readData("History") === null) {
    writeData("History", []);
  }
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

function openPopUp (target) {
  if (target == null) return
  const path = target.path.reverse();
  const volumeId = path[5].dataset.volumeId;
  const arrayId = path[5].dataset.array;
  const storageArray = readData(arrayId);
  console.log(`volumeID = ${volumeId}`)
  const volumeInfo = storageArray[volumeId];

  popUpTitle.textContent = volumeInfo.title;
  popUpDesc.textContent = volumeInfo.description
  popUpImage.style.background = `url(${volumeInfo.imageLinks.thumbnail}) no-repeat center center`;
  popUpAuth.textContent = `Author:  ${volumeInfo.authors}`;
  popUpPublished.textContent = `Published By:  ${volumeInfo.publishedDate}`;
  popUpPublisher.textContent = `Published By:  ${volumeInfo.publisher}`;
  popUpPrint.textContent = `Print Type:  ${volumeInfo.printType}`;
  popUp.dataset.volumeId = volumeId //COULD BE IMPORTANT TO CHANGE THIS LATER!
  popUp.dataset.arrayId = arrayId; // ID the correct storage array

  popup.classList.add("active");
  popupOverlay.classList.add("active");
}

function closePopUp (target) {
  popup.classList.remove("active");
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
    //placeholder if link missing
    else {
      imageUrls.push("assets/images/bookcover-placeholder.jpg");
    }
  }
  return imageUrls;
}

function saveSearchHistory (userInput) {
  let history = readData("History");
  history.push(userInput);
  console.log(history);
  writeData("History", history);
}