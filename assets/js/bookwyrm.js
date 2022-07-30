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
const popGoogleLink = document.getElementById("google");
const popGoogleBtn = document.getElementById("google-btn");
const addPin = '<i class="fa-solid fa-thumbtack"></i> To Home'
const removePin = '<i class="fa-solid fa-x"></i> From Home'
const addBklst = '<i class="fa-solid fa-plus"></i> Booklist'
const removeBklst = '<i class="fa-solid fa-x"></i> From Booklist'
const addedBklst = '<i class="fa-solid fa-circle-check"></i> Booklist'
const addedPin = '<i class="fa-solid fa-circle-check"></i> Pinned!'

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
  generateCards("PinList", pinnedCardContainer, pinnedCardTemplate);
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
  const btn = e.path[0];
  if (btn.innerHTML === addedBklst || btn.innerHTML === removeBklst) return
  //change button style on click
  btn.classList.remove("pop-btn");
  btn.classList.add("pop-btn-green");
  btn.innerHTML = addedBklst;
  //save
  saveToList("BookList", "BookListTitles");
})

//same as above except for pin button and list
popPinBtn.addEventListener("click", e => {
  const btn = e.path[0];
  if (btn.innerHTML === addedPin || btn.innerHTML === removePin) return
  btn.classList.remove("pop-btn");
  btn.classList.add("pop-btn-green");
  btn.innerHTML = addedPin;
  saveToList("PinList", "PinListTitles");
})

//clicking button automatically clicks and opens link to google books
popGoogleBtn.addEventListener("click", () => {
  popGoogleLink.click();
});

//_________________________________FUNCTION DECLARATIONS___________________________________________//

//perform the query and save the data to local storage
async function performApiQuery(userInput) {
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
  generateCards("LastSearch", cardContainer, cardTemplate);
}
//cards displaying search results
function generateCards(key, container, template) {
  const bookList = readData(key);
  const imageList = generateImageList(bookList);
  for (let i = 0; i < bookList.length; i++) {
    const cloneCard = template.content.cloneNode(true).children[0];
    const cardImage = cloneCard.querySelectorAll(".image")[0];
    const cardTitle = cloneCard.querySelectorAll(".book-title")[0];
    const cardAuthor = cloneCard.querySelectorAll(".book-auth")[0];
    //limit string length on cards
    let title = bookList[i].title;
    if (title.length > 30) {
      title = title.substring(0, 30) + "..."
    }
    cardImage.style.background = `url(${imageList[i]}) no-repeat center center`;
    cardTitle.innerHTML = title;
    cardAuthor.innerHTML = bookList[i].authors;
    cloneCard.dataset.volumeId = [i]; //so book can be found in local storage
    cloneCard.dataset.array = key;
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
function openPopUp(target) {
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

function populatePopUp(volumeInfo, arrayId, volumeId) {
  popUpTitle.innerHTML = volumeInfo.title;
  popUpDesc.innerHTML = volumeInfo.description
  popUpImage.style.background = `url(${volumeInfo.imageLinks.thumbnail}) no-repeat center center`;
  popUpAuth.innerHTML = `Author:  ${volumeInfo.authors}`;
  popUpPublished.innerHTML = `Published By:  ${volumeInfo.publishedDate}`;
  popUpPublisher.innerHTML = `Published By:  ${volumeInfo.publisher}`;
  popUpPrint.innerHTML = `Print Type:  ${volumeInfo.printType}`;
  popUp.dataset.volumeId = volumeId //COULD BE IMPORTANT TO CHANGE THIS LATER!
  popUp.dataset.arrayId = arrayId; // ID the correct storage array
  //add external link to google books page
  popGoogleLink.setAttribute("href", volumeInfo.canonicalVolumeLink);
  popGoogleLink.setAttribute("target", "_blank");

  changeButtons();
}

//removes popup window
function closePopUp(target) {
  popUp.classList.remove("active");
  popupOverlay.classList.remove("active");
  //remove style on buttons
  popBooklistBtn.removeAttribute("class");
  popPinBtn.removeAttribute("class");
  popBooklistBtn.innerHTML = "";
  popPinBtn.innerHTML = "";
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
function saveSearchHistory(userInput) {
  let history = readData("History");
  history.push(userInput);
  console.log(history);
  writeData("History", history);
}

//can use for multiple lists 
function saveToList(listKey, listTitlesKey) {
  //list to be saved to
  const list = readData(listKey);
  //list of titles saved in the list
  const listTitles = readData(listTitlesKey);
  //id of the volume currently displayed on open popup
  const volumeId = popUp.dataset.volumeId;
  //id of the storage array populating the open popup
  const arrayId = popUp.dataset.arrayId;
  //should get the book object currently being displayed
  let sourceArray = readData(arrayId);

  //prevent duplicates and null values
  for (let i = 0; i < listTitles.length; i++) {
    if (listTitles[i] === sourceArray[volumeId].title || sourceArray[volumeId].title === null) return
  }
  //save displayed book object to new appropriate list
  list.push(sourceArray[volumeId]);
  writeData(listKey, list);
  listTitles.push(sourceArray[volumeId].title);
  writeData(listTitlesKey, listTitles);
}

function populateDropdown(titlesKey, listKey, dropdownName) {
  let titlesArray = readData(titlesKey);
  const objectArray = readData(listKey);
  const menuDropdown = document.getElementById(dropdownName);
  //generate the links and populate
  for (let i = 0; i < titlesArray.length; i++) {
    let newA = document.createElement("a");
    if (titlesArray[i].length > 15) {
      titlesArray[i] = titlesArray[i].substring(0, 13) + "..."
    }
    newA.innerHTML = titlesArray[i];
    newA.setAttribute("data-id", i);
    menuDropdown.appendChild(newA);

    //add event listeners to each new link added
    let newDropdownItem = menuDropdown.getElementsByTagName("a")[i];
    // initiates appropriate action upon clicking a dropdown link
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
        populatePopUp(volumeInfo, listKey, volumeId);
        //style the buttons
        popUp.classList.add("active");
        popupOverlay.classList.add("active");
      });
    }
  } 
}

function changeButtons() {
  console.log(readData("PinListTitles"));
  console.log(readData("BookListTitles"));
  console.log(popUpTitle.innerHTML);

  console.log(`bklst worked: ${readData("BookListTitles").length}`)
  popBooklistBtn.classList.add("pop-btn");
  popBooklistBtn.innerHTML = addBklst;

  for (let i = 0; i < readData("BookListTitles").length; i++) {
    if (popUpTitle.innerHTML === readData("BookListTitles")[i]) {
      popBooklistBtn.classList.add("pop-btn-red");
      popBooklistBtn.innerHTML = removeBklst;
    }
  }

  console.log(`pin worked: ${readData("PinListTitles").length}`)
  popPinBtn.classList.add("pop-btn");
  popPinBtn.innerHTML = addPin;

  for (let i = 0; i < readData("PinListTitles").length; i++) {
    if (popUpTitle.innerHTML === readData("PinListTitles")[i]) {
      popPinBtn.classList.add("pop-btn-red");
      popPinBtn.innerHTML = removePin;
    } 
  }
}



// popBooklistBtn.classList.add("pop-btn-red");
// popBooklistBtn.innerHTML = '<i class="fa-solid fa-x"></i> From Booklist';
// popPinBtn.classList.add("pop-btn");
// popPinBtn.innerHTML = '<i class="fa-solid fa-thumbtack"></i> to home'