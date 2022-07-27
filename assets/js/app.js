//global variables for DOM manipulation
const searchBar = document.getElementById("search");
const searchBarInput = document.getElementById("search").value;
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
const cardVolumeId = document.getElementsByClassName("volume-id")[0];
const popUp = document.getElementById("popup");
const popUpHeader = document.getElementsByClassName("popup-header")[0];
const popUpTitle = document.getElementsByClassName("pop-title")[0];
const popUpSubHeader = document.getElementsByClassName("popup-subheader")[0];
const popUpImage= document.getElementsByClassName("pop-image")[0];
const popUpDetails = document.getElementsByClassName("pop-details")[0];
const popUpBody = document.getElementsByClassName("popup-body")[0];
const popUpDesc = document.getElementsByClassName("pop-desc")[0];
const popUpBookId = document.getElementsByClassName("pop-book-id")[0];
const popUpButtonsCont = document.getElementsByClassName("popup-button")[0];
const popBooklistBtn = document.getElementById("save-to-booklist");
const popPinBtn = document.getElementById("pin");
const popGoogleBtn = document.getElementById("google");

//--------------------------------------EVENT LISTENERS--------------------------------------//

//on initial load
window.addEventListener("load", () => {
  const storageArrays = ["History", "BookList", "BookListTitles", "PinnedList", "PinnedListTitles", "LastSearch"];
  //create the required local storage arrays
  for (let item in storageArrays) {
    if (readData(item) == null) {
      writeData(item, []);
    }
  }
  //generate the pinned cards if any
  if (readData("PinnedList").length !== 0) {
    generateCards("PinnedList", pinnedCardContainer);

    let newPinnedCards = document.querySelectorAll(".card");
    newPinnedCards.forEach(card => {card.addEventListener("click", populatePopUp);
    //ADD CODE HERE TO GENERATE POPUP ONCE AN APPROPRIATE FUNCTION IS AVAILABLE
    })
  }
})

//Peform the search
searchBtn.addEventListener("click", () => {
  //hide any pinned cards
  if (readData("PinnedList").length !== 0) {
    pinnedCardContainer.classList.add("hidden");
  }

  performApiQuery(searchBarInput);
  saveSearchHistory();
  generateCards("History", cardContainer);
  

  navBar.classList.add("hidden");
  searchContainer.classList.add("hidden");
  logo.classList.add("on-search");
  popBooklistBtn.classList.remove("saved");
  popBooklistBtn.innerHTML = "To Booklist";

  //delayed appearance of a refresh button
  setTimeout(() => {
    refreshBtn.classList.remove("hidden");
  }, 1000);
})

// Perform search upon hitting enter 
searchBar.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

refreshBtn.addEventListener("click", () => {
    location.reload();
})

//----------------------------------------FUNCTION DECLARATIONS------------------------------------//

async function performApiQuery (userInput) {
  const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${userInput}&maxResults=40&langRestrict=en`);
  const response = await fetch(endpoint);
  const data = await response.json();
  writeData("LastSearch", data)
}

function generateCards (key, container) {
  const storageArray = readData(key);  
  for (let i = 0; i < storageArray.length; i++) {
    const volumeInfo = storageArray[i].volumeInfo;
    const image = volumeInfo.imageLinks.thumbnail;
    const cloneCard = pinnedCardTemplate.content.cloneNode(true).children[0];
    cardImage.style.background = `url(${image}) no-repeat center center`;
    cardTitle.textContent = volumeInfo.title;
    bookAuthor.textContent = volumeInfo.authors;
    cardVolumeId.classList.add(i); //so book can be found in local storage
    container.append(cloneCard);
  }
}

function populatePopUp () {

}

function saveSearchHistory () {

}

function readData (key) {
  return JSON.parse(localStorage.getItem(key) || [])
}

function writeData (key, data) {
  return JSON.stringify(localStorage.setItem(key, data))
}

function removeListDuplicates(list) {
    let unique = [...new Set(list)]
    return unique
}