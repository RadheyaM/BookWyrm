//_________________________GLOBAL CONSTANTS_______________________________________

const searchBar = document.getElementById("search");
const searchContainer = document.getElementsByClassName("search-container")[0];
const searchBtn = document.getElementById("search-btn");
const refreshBtnContainer = document.getElementsByClassName("refresh")[0];
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
const popUpImage = document.getElementsByClassName("pop-image")[0];
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
const addPin = '<i class="fa-solid fa-thumbtack"></i> To Home';
const removePin = '<i class="fa-solid fa-circle-minus"></i> Unpin';
const addBklst = '<i class="fa-solid fa-plus"></i> Booklist';
const removeBklst = '<i class="fa-solid fa-circle-minus"></i> From Booklist';
const addedBklst = '<i class="fa-solid fa-circle-check"></i> Booklist';
const addedPin = '<i class="fa-solid fa-circle-check"></i> Pinned!';
const removed = '<i class="fa-solid fa-trash"></i> Removed!';
const clearHistory = document.getElementById("clear-history");
const clearBooklist = document.getElementById("clear-booklist");
const clearPinlist = document.getElementById("clear-pinlist");
//const for changing color theme
const root = document.querySelector(":root");
const toggle = document.getElementById("toggle");
const darkestBlue = "#03045E";
const darkBlue = "#0077B6";
const mediumBlue = "#00B4D8";
const lightBlue = "#90E0EF";
const lightishBlue = "#caf0f8"
const lightestBlue = "#caf0f866";
const lightGreen = "#06d6a0";
const darkYellow = "#edae49";
const bodyBg = "--body-bg";
const maintxt = "--main-txt";
const dpHoverBg = "--dropdown-hover-bg";
const cardBg = "--card-bg";
const cardImageBg = "--card-backup-bg";
const cardTxt = "--card-txt";
const popBtnStd = "--pop-btn-std";
const popBtnSaved = "--pop-btn-saved";
const popBtnRemove = "--pop-btn-remove";
const btnHoverTxt = "--btn-hover-txt";
const dpBg = "--dropdown-bg";
const dpTxt = "--dropdown-list-txt";
const popBg = "--pop-bg";
const white = [
  "--nav-txt",
  "--btn-txt",
  "--btn-hover-bg",
  "--pop-btn-txt"
];
//becomes dark blue
const whiteSmoke = [
  "--search-txt",
  "--card-backup-bg",
  "--card-border",
  "--card-header-bg",
  "--pop-border",
];
//becomes lightest blue
const black = [
  "--pop-header-border",
  "--search-bg",
  "--btn-bg",
  "--card-bg",
  "--pop-overlay",
];

//_____________________________ EVENT LISTENERS__________________________________________

// on initial load
window.addEventListener("load", () => {
  //LastSearch is for populating popups on card click after a search
  writeData("LastSearch", []);
  //generate storage arrays if they do not already exist
  const storageKeys = [
    "History",
    "BookList",
    "BookListTitles",
    "PinList",
    "PinListTitles",
  ];
  for (let i = 0; i < storageKeys.length; i++) {
    if (readData(storageKeys[i]) === null) {
      writeData(storageKeys[i], []);
    }
  }
  // to store active theme
  if (readData("Theme") === null) {
    writeData("Theme", "default");
  }
  //populate the dropdowns, generate pinned cards
  populateDropdown("History", "History", "history-dropdown");
  populateDropdown("BookListTitles", "BookList", "booklist-dropdown");
  generateCards("PinList", pinnedCardContainer, pinnedCardTemplate);
  if (readData("Theme") === "blue") {
    activateLightTheme();
  }
});

//Peform the search
searchBtn.addEventListener("click", () => {
  //hide any pinned cards
  if (readData("PinList").length !== 0) {
    const pinnedCardContainer = document.getElementById(
      "pinned-cards-container"
    );
    pinnedCardContainer.classList.add("hidden");
  }
  const searchBarInput = document.getElementById("search").value;
  //Query google books with user search
  performApiQuery(searchBarInput);
  //save history
  saveSearchHistory(searchBarInput);
  //change view so that new search requires page reset
  navBar.classList.add("hidden");
  searchContainer.classList.add("hidden");
  logo.style.padding = 0;
  refreshBtn.innerHTML = ' <i class="fa-solid fa-arrows-rotate"></i> New Search';
  //delayed appearance of a refresh button
  setTimeout(() => {
    refreshBtnContainer.classList.remove("hidden");
  }, 1000);
});

searchBar.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

//close popup on clicking overlay
popupOverlay.addEventListener("click", closePopUp);

//dark/light mode toggle button
toggle.addEventListener("click", () => {
  let theme = readData("Theme");
  if (theme === "default") {
    activateLightTheme();
    writeData("Theme", "blue");
    return
  }
  activateDarkTheme();
  writeData("Theme", "default");
});

//refresh button reloads the page
refreshBtn.addEventListener("click", () => {
  location.reload();
});

//settings
clearHistory.addEventListener("click", () => {
  if (confirm("Delete all history?") == true) {
    if (confirm("Are you sure?\n Removed info cannot be restored...") == true) {
      writeData("History", []);
      location.reload();
    } else {
      return
    }
  } else {
    return
  }
})

clearBooklist.addEventListener("click", () => {
  if (confirm("Clear Booklist?") == true) {
    if (confirm("Are you sure?\n Removed info cannot be restored...") == true) {
      writeData("BookList", []);
      writeData("BookListTitles", []);
      location.reload();
    } else {
      return
    }
  } else {
    return
  }
})

clearPinlist.addEventListener("click", () => {
  if (confirm("Remove All Pin Cards?") == true) {
    if (confirm("Are you sure?\n Removed info cannot be restored...") == true) {
      writeData("PinList", []);
      writeData("PinListTitles", []);
      location.reload();
    } else {
      return
    }
  } else {
    return
  }
})

closePopupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.closest(".popup"); //checks for the closest parent of a button element with class popup
    closePopUp(target);
  });
});

//clicking To Booklist button on popup window saves that book to BookList
popBooklistBtn.addEventListener("click", (e) => {
  const btn = e.path[0];
  console.log(e);
  if (btn.innerHTML === addedBklst || btn.innerHTML === removed) return;
  if (btn.innerHTML === removeBklst) {
    btn.innerHTML = removed;
    removeData("BookList", "BookListTitles", popUpTitle.innerHTML);
    return;
  }
  //change button style on click
  btn.classList.remove("pop-btn");
  btn.classList.add("pop-btn-green");
  btn.innerHTML = addedBklst;
  //save
  saveToList("BookList", "BookListTitles");
});

//same as above except for pin button and list
popPinBtn.addEventListener("click", (e) => {
  const btn = e.path[0];
  if (btn.innerHTML === addedPin || btn.innerHTML === removed) return;
  if (btn.innerHTML === removePin) {
    btn.innerHTML = removed;
    removeData("PinList", "PinListTitles", popUpTitle.innerHTML);
    return;
  }
  btn.classList.remove("pop-btn");
  btn.classList.add("pop-btn-green");
  btn.innerHTML = addedPin;
  saveToList("PinList", "PinListTitles");
});

//clicking button automatically clicks and opens link to google books
popGoogleBtn.addEventListener("click", () => {
  popGoogleLink.click();
});

//_________________________________FUNCTION DECLARATIONS___________________________________________//

//perform the query and save the data to local storage
async function performApiQuery(userInput) {
  const endpoint = new URL(
    `https://www.googleapis.com/books/v1/volumes?q=${userInput}&maxResults=40&langRestrict=en`
  );
  console.log(endpoint);
  const response = await fetch(endpoint);
  const data = await response.json();
  //commit the search results to local storage
  let searchItems = [];
  for (let i = 0; i < data.items.length; i++) {
    searchItems.push(data.items[i].volumeInfo);
  }
  writeData("LastSearch", searchItems);
  generateCards("LastSearch", cardContainer, cardTemplate);
}
//cards displaying search results
function generateCards(key, container, template) {
  const removeDup = new Set(readData(key));
  const bookList = Array.from(removeDup);
  const imageList = generateImageList(bookList);
  for (let i = 0; i < bookList.length; i++) {
    const cloneCard = template.content.cloneNode(true).children[0];
    const cardImage = cloneCard.querySelectorAll(".image")[0];
    const cardTitle = cloneCard.querySelectorAll(".book-title")[0];
    const cardAuthor = cloneCard.querySelectorAll(".book-auth")[0];
    //limit string length on cards
    let title = bookList[i].title;
    if (title.length > 30) {
      title = title.substring(0, 30) + "...";
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
    bookCards.forEach((card) => {
      card.addEventListener(clickTouch(), openPopUp);
    });
  }
}
//identifies the bookobject from card clicked and opens popup
function openPopUp(target) {
  if (target == null) return;
  const path = target.path.reverse();
  const volumeId = path[5].dataset.volumeId;
  const arrayId = path[5].dataset.array;
  const storageArray = readData(arrayId);
  const volumeInfo = storageArray[volumeId];

  populatePopUp(volumeInfo, arrayId, volumeId);

  popUp.classList.add("active");
  popupOverlay.classList.add("active");
}

function populatePopUp(volumeInfo, arrayId, volumeId) {
  popUpTitle.innerHTML = volumeInfo.title;
  popUpDesc.innerHTML = volumeInfo.description;
  popUpImage.style.background = `url(${volumeInfo.imageLinks.thumbnail}) no-repeat center center`;
  popUpAuth.innerHTML = `Author:  ${volumeInfo.authors}`;
  popUpPublished.innerHTML = `Published By:  ${volumeInfo.publishedDate}`;
  popUpPublisher.innerHTML = `Published By:  ${volumeInfo.publisher}`;
  popUpPrint.innerHTML = `Print Type:  ${volumeInfo.printType}`;
  popUp.dataset.volumeId = volumeId; //COULD BE IMPORTANT TO CHANGE THIS LATER!
  popUp.dataset.arrayId = arrayId; // ID the correct storage array
  //add external link to google books page
  popGoogleLink.setAttribute("href", volumeInfo.canonicalVolumeLink);
  popGoogleLink.setAttribute("target", "_blank");
  //give buttons appropriate style
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

//read data in local storage
function readData(key) {
  return JSON.parse(localStorage.getItem(key));
}
//write data to local storage
function writeData(key, data) {
  if (key == null || data == null) {
    console.log("Trying to add null value to local storage");
    return;
  }
  return localStorage.setItem(key, JSON.stringify(data));
}
//remove data from a specified local storage array
function removeData(listKey, listTitlesKey, titleToRemove) {
  let list = readData(listKey);
  let listTitles = readData(listTitlesKey);
  const removeTitlesIndex = listTitles.indexOf(titleToRemove);

  list.splice(removeTitlesIndex, 1);
  listTitles.splice(removeTitlesIndex, 1);
  writeData(listKey, list);
  writeData(listTitlesKey, listTitles);
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
  writeData("History", history);
}

//can use for multiple lists
function saveToList(listKey, listTitlesKey) {
  //list to be saved to
  const list = readData(listKey);

  //list of titles saved
  const listTitles = readData(listTitlesKey);

  //id of the volume currently displayed on open popup
  const volumeId = popUp.dataset.volumeId;

  //id of the storage array populating the open popup
  const arrayId = popUp.dataset.arrayId;

  //should get the book object currently being displayed
  let sourceArray = readData(arrayId);

  //prevent duplicates and null values
  for (let i = 0; i < listTitles.length; i++) {
    if (
      listTitles[i] === sourceArray[volumeId].title ||
      sourceArray[volumeId].title == null
    )
      return;
  }
  //save displayed book object to new appropriate list
  list.push(sourceArray[volumeId]);
  writeData(listKey, list);
  listTitles.push(sourceArray[volumeId].title);
  writeData(listTitlesKey, listTitles);
}

function populateDropdown(titlesKey, listKey, dropdownName) {
  const removeDup = new Set(readData(titlesKey));
  const titlesArray = Array.from(removeDup);
  const objectArray = readData(listKey);
  const menuDropdown = document.getElementById(dropdownName);
  //generate the links and populate
  for (let i = 0; i < titlesArray.length; i++) {
    let newA = document.createElement("a");
    if (titlesArray[i].length > 15) {
      titlesArray[i] = titlesArray[i].substring(0, 13) + "...";
    }
    newA.innerHTML = titlesArray[i];
    newA.setAttribute("data-id", i);
    menuDropdown.appendChild(newA);

    //add event listeners to each new link added
    let newDropdownItem = menuDropdown.getElementsByTagName("a")[i];
    // initiates appropriate action upon clicking a dropdown link
    if (dropdownName === "history-dropdown") {
      newDropdownItem.addEventListener(clickTouch(), (event) => {
        searchBar.value = event.path[0].innerHTML;
        searchBtn.click();
      });
    } else {
      newDropdownItem.addEventListener(clickTouch(), (event) => {
        const volumeId = event.path[0].getAttribute("data-id");
        const volumeInfo = objectArray[volumeId];
        populatePopUp(volumeInfo, listKey, volumeId);
        //style the buttons
        popUp.classList.add("active");
        popupOverlay.classList.add("active");
      });
    }
  }
}
//attempt to fix some issues on ios touchscreen devices
function clickTouch() {
  if ("ontouchstart" in document.documentElement === true) {
    return 'touchstart';
  } else {
    return 'click'
  }

}

function changeButtons() {
  popBooklistBtn.classList.add("pop-btn");
  popBooklistBtn.innerHTML = addBklst;

  for (let i = 0; i < readData("BookListTitles").length; i++) {
    if (popUpTitle.innerHTML === readData("BookListTitles")[i]) {
      popBooklistBtn.classList.add("pop-btn-red");
      popBooklistBtn.innerHTML = removeBklst;
    }
  }
  popPinBtn.classList.add("pop-btn");
  popPinBtn.innerHTML = addPin;

  for (let i = 0; i < readData("PinListTitles").length; i++) {
    if (popUpTitle.innerHTML === readData("PinListTitles")[i]) {
      popPinBtn.classList.add("pop-btn-red");
      popPinBtn.innerHTML = removePin;
    }
  }
}

function activateLightTheme() {
  //change colors on toggle click
  root.style.setProperty(maintxt, darkBlue);
  root.style.setProperty(bodyBg, "white");
  root.style.setProperty(dpHoverBg, lightestBlue);
  root.style.setProperty(cardBg, lightBlue);
  root.style.setProperty(cardTxt, darkestBlue);
  root.style.setProperty(cardImageBg, lightBlue);
  root.style.setProperty(popBtnStd, lightBlue);
  root.style.setProperty(btnHoverTxt, "white");
  root.style.setProperty(dpBg, lightishBlue);
  root.style.setProperty(dpTxt, darkBlue);
  root.style.setProperty(popBg, "white");
  root.style.setProperty(popBtnSaved, lightGreen);
  root.style.setProperty(popBtnRemove, darkYellow);

  for (let i = 0; i < white.length; i++) {
    root.style.setProperty(white[i], darkestBlue);
  }
  for (let i = 0; i < whiteSmoke.length; i++) {
    root.style.setProperty(whiteSmoke[i], darkBlue);
  }
  for (let i = 0; i < black.length; i++) {
    root.style.setProperty(black[i], lightestBlue);
  }
}

function activateDarkTheme() {
  //change colors on toggle click
  root.style.setProperty(maintxt, "#868b90");
  root.style.setProperty(bodyBg, "#202124");
  root.style.setProperty(dpHoverBg, "red");
  root.style.setProperty(cardBg, "rgba(0, 0, 0, .9);");
  root.style.setProperty(cardTxt, "#777");
  root.style.setProperty(cardImageBg, "whitesmoke");
  root.style.setProperty(popBtnStd, "grey");
  root.style.setProperty(btnHoverTxt, "black");
  root.style.setProperty(dpBg, "white");
  root.style.setProperty(dpTxt, "black");
  root.style.setProperty(popBg, "rgba(0, 0, 0, .9)");
  root.style.setProperty(popBtnSaved, "green");
  root.style.setProperty(popBtnRemove, darkYellow);

  for (let i = 0; i < white.length; i++) {
    root.style.setProperty(white[i], "white");
  }
  for (let i = 0; i < whiteSmoke.length; i++) {
    root.style.setProperty(whiteSmoke[i], "whitesmoke");
  }
  for (let i = 0; i < black.length; i++) {
    root.style.setProperty(black[i], "black");
  }
}