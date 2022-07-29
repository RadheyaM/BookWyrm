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
const card = document.getElementsByClassName("card")[0];
const cardHeader = document.getElementsByClassName("card-header")[0];
const cardImage = document.getElementsByClassName("card-image")[0];
const cardBody = document.getElementsByClassName("card-body")[0];
const cardTitle = document.getElementsByClassName("book-title")[0];
const cardAuthor = document.getElementsByClassName("book-auth")[0];
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
  if (readData("LastSearch") == null) {
    writeData("LastSearch", []);
    console.log(readData("LastSearch"));
  }
});

//Peform the search
searchBtn.addEventListener("click", () => {
  //hide any pinned cards
  const searchBarInput = document.getElementById("search").value;
  //Query google books with user search
  performApiQuery(searchBarInput);
  console.log(readData("LastSearch"));
  //save the search term
  // saveSearchHistory();
  // //generate cards to display search results
  // generateCards("History", cardContainer);
})
//----------------------------------------FUNCTION DECLARATIONS------------------------------------//

async function performApiQuery (userInput) {
  const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${userInput}&maxResults=40&langRestrict=en`);
  const response = await fetch(endpoint);
  const data = await response.json();
  //console.log(data.items);
  //commit the search results to local storage
  let searchItems = [];
  for (let i = 0; i < data.items.length; i++) {
    searchItems.push(data.items[i]);
  }
  console.log(searchItems);
  writeData("LastSearch", searchItems);
}

function readData (key) {
  return JSON.parse(localStorage.getItem(key))
}
  
function writeData (key, data) {
  return localStorage.setItem(key, JSON.stringify(data))
}