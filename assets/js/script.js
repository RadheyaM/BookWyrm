//create the required local storage arrays
window.addEventListener("load", () => {
  const storageArrays = ["History", "BookList", "BookListTitles", "PinnedList", "PinnedListTitles"];
  for (let i = 0; i < storageArrays.length; i++) {
    if (localStorage.getItem(`${storageArrays[i]}`) == null) {
      localStorage.setItem(`${storageArrays[i]}`, "[]");
    }
  }
})

//------------------------------------PERFORMING THE SEARCH -------------------------------------
const searchButton = document.getElementById("search-btn");
searchButton.addEventListener("click", () => {
  const generalSearchInput = document.getElementById("search").value;
  const searchContainer = document.getElementsByClassName("search-container")[0];
  const navBar = document.getElementsByClassName("navbar")[0];
  const logo = document.getElementById("logo");
  const refreshButton = document.getElementsByClassName("refresh")[0];
  performApiQuery(generalSearchInput);
  saveSearchHistory(generalSearchInput);
  navBar.classList.add("hidden");
  searchContainer.classList.add("hidden");
  logo.classList.add("on-search");
  document.getElementById("save-to-booklist").classList.remove("saved");
  document.getElementById("save-to-booklist").innerHTML = "To Booklist";
  //delay the appearance of the refresh button
  setTimeout(() => {
    refreshButton.classList.remove("hidden");
  }, 1000);
});

// Perform search upon hitting enter 
const searchBar = document.getElementById("search");
searchBar.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});

//query the google books api and return results based on user input
async function performApiQuery() {
  const generalSearchInput = document.getElementById("search").value;
  const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${generalSearchInput}&maxResults=40&langRestrict=en`);
  const response = await fetch(endpoint);
  const data = await response.json();
  localStorage.setItem("lastSearch", JSON.stringify(data));
  generateHTMLCards(data, generateImageList(data));
}

//generate a list of image source pathways from API response data
function generateImageList(data) {
  let imageUrls = [];
  for (let i = 0; i < data.items.length; i++) {
    //prevent uncaught type-error due to missing image url
    if (data.items[i].volumeInfo.imageLinks !== undefined) {
      imageUrls.push(data.items[i].volumeInfo.imageLinks.thumbnail);
    }
    //placeholder if link missing
    else {
      imageUrls.push("assets/images/bookcover-placeholder.jpg");
    }
  }
  return imageUrls;
}

//generate populated cards to display results below search bar
function generateHTMLCards(data, list) {
  for (let i = 0; i < data.items.length; i++) {
    const dataVolumeInfo = data.items[i].volumeInfo;
    const bookCardTemplate = document.querySelector("#book-card-template");
    const bookCardContainer = document.querySelector("#book-cards-container");  
    const card = bookCardTemplate.content.cloneNode(true).children[0];
    const bookCover = card.querySelector("[book-cover]");
    const bookTitle = card.querySelector("[book-title]");
    const bookAuthor = card.querySelector("[book-auth]");
    const dataIdentifier = card.querySelector("[data-identifier]");
  
    bookCover.style.background = `url(${list[i]}) no-repeat center center`;
    bookTitle.textContent = dataVolumeInfo.title;
    bookAuthor.textContent = dataVolumeInfo.authors;
    dataIdentifier.textContent = i;
    bookCardContainer.append(card);

    let bookCards = document.querySelectorAll(".card");
    //Generate event listeners on each card
    bookCards.forEach(card => {
      card.addEventListener("click", openPopUp);
    })
  }
}
//Clear Results button
const refresh = document.getElementById("refresh");
refresh.addEventListener("click", () => {
  location.reload();
})

//-------------------------------------------THE POP-UP WINDOW-------------------------------------------

//pop-up variables
const openPopupButtons = document.querySelectorAll("[data-popup-target]");
const closePopupButtons = document.querySelectorAll("[data-close-button]");
const popupOverlay = document.getElementById("popup-bg");

//opens and populates the popup window
function openPopUp (target) {
  if (target == null) return
  const content = JSON.parse(localStorage.getItem("lastSearch"));
  const imageList = generateImageList(content);
  const path = target.path.reverse();
  const contentIndex = path[5].children[2].innerHTML;
  const contentVolumeInfo = content.items[contentIndex].volumeInfo;
  const popHeader = document.querySelector("[book-title]");
  const popImage = document.querySelector("[book-cover]");
  const popDesc = document.querySelector("[book-desc]")
  const popAuthor = document.querySelector("[author]")
  const popPublishedDate = document.querySelector("[published]")
  const popPublisher = document.querySelector("[publisher]")
  const popCategory = document.querySelector("[categories]")
  const bookIdentifier = document.querySelector("[book-identifier]");
  const bookListTitles = JSON.parse(localStorage.getItem("BookListTitles"));
  const toBookListButton = document.getElementById("save-to-booklist");

  for (let i = 0; i < bookListTitles.length; i++) {
    if (bookListTitles[i] === contentVolumeInfo.title) {
      document.getElementById("save-to-booklist").classList.add("saved");
      toBookListButton.innerHTML = '<i class="fa-solid fa-circle-check"></i> Booklist';
    }
  }
  popHeader.textContent = contentVolumeInfo.title;
  popDesc.textContent = contentVolumeInfo.description;
  popImage.style.background = `url(${imageList[contentIndex]}) no-repeat center center`;
  popAuthor.textContent = `Author: ${contentVolumeInfo.authors}`;
  popPublishedDate.textContent = `Date Published: ${contentVolumeInfo.publishedDate}`;
  popPublisher.textContent = `Published By: ${contentVolumeInfo.publisher}`;
  popCategory.textContent = `Print Type: ${contentVolumeInfo.printType}`;
  bookIdentifier.textContent = contentIndex;



  //add appropriate link to googlebooks button
  const viewOnGoogle = document.getElementById("google");
  viewOnGoogle.setAttribute("href", contentVolumeInfo.canonicalVolumeLink);
  viewOnGoogle.setAttribute("target", "_blank");

  //enable pin button on popup to create a pinned list
  const pin = document.getElementById("pin");
  pin.addEventListener("click", e => {
    const pinnedList = JSON.parse(localStorage.getItem("PinnedList"));
    const pinnedListTitles = JSON.parse(localStorage.getItem("PinnedListTitles"));

    for (let i = 0; i < pinnedListTitles.length; i++) {
      if(pinnedListTitles[i] === contentVolumeInfo.title) return
    }
  
    //add object to book list
    pinnedList.push(content.items[contentIndex]);
    console.log(pinnedList);
    
    //commit all back to local storage
    localStorage.setItem("PinnedList", JSON.stringify(pinnedList));
  
    //update the book list titles list
    const title = pinnedList[pinnedList.length - 1 || 0].volumeInfo.title
    console.log(title);
  
    pinnedListTitles.push(title);
    localStorage.setItem("pinnedListTitles", JSON.stringify(pinnedListTitles));
    console.log(pinnedListTitles);
  })

  //make it visible
  popup.classList.add("active");
  popupOverlay.classList.add("active");
}
 //make it be gone
function closePopUp (target) {
  if (target == null) return
  const saveButton = document.getElementById("save-to-booklist")
  popup.classList.remove("active");
  popupOverlay.classList.remove("active");
  //remove the green button
  saveButton.classList.remove("saved");
  saveButton.innerHTML = "To Booklist";

}

closePopupButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.closest(".popup"); //checks for the closest parent of a button element with class popup
    closePopUp(target);
  })
})

// ----------------------------------------HISTORY USING LOCAL STORAGE----------------------------------------

//Keep a search history record using local storage
function saveSearchHistory(searchInput){
  //add the search input to local storage History item
  const existingHistory = JSON.parse(localStorage.getItem("History"));
  existingHistory.push(searchInput);
  let newHistory = removeListDuplicates(existingHistory);
  //commit all back to local storage
  localStorage.setItem("History", JSON.stringify(newHistory));
}

//dropdown displaying search history
function populateHistoryDropdown() {
 if (JSON.parse(localStorage.getItem("History")) !== null) {
    const history = JSON.parse(localStorage.getItem("History")).reverse();
    const menuDropdown = document.getElementsByClassName("navbar")[0].getElementsByClassName("dropdown-content")[1];
    const searchBar = document.getElementById("search");

    for (let i = 0; i < history.length; i++) {
      let newA = document.createElement("a");
      newA.innerHTML = history[i];
      menuDropdown.appendChild(newA);

      let newDropdownItem = menuDropdown.getElementsByTagName("a")[i];
      // initiates search on term clicked in the history dropdown
      newDropdownItem.addEventListener("click", e => {
        searchBar.value = e.path[0].innerHTML;
        searchButton.click()
      });
    }
 }
}

//populate the list when page is reloaded
window.addEventListener("load", populateHistoryDropdown);

//-----------------------------------------------------USER BOOKLIST ------------------------------------------------------------------------
//Allow the user to save a particular book to a list
const saveBook = document.getElementById("save-to-booklist");
saveBook.addEventListener("click", e => {
  //change button style on click
  e.path[0].classList.add("saved");
  e.path[0].innerHTML = '<i class="fa-solid fa-circle-check"></i> Booklist';

  const bookId = document.querySelector("[book-identifier]").innerHTML;
  const bookObject = JSON.parse(localStorage.getItem("lastSearch")).items[bookId];

  //add the book corresponding to selected popup preview button
  const existingBookList = JSON.parse(localStorage.getItem("BookList"));
  const bookListTitles = JSON.parse(localStorage.getItem("BookListTitles"));
  
  //prevent duplicates in the booklist

  for (let i = 0; i < bookListTitles.length; i++) {
    if(bookListTitles[i] === bookObject.volumeInfo.title) return
  }

  //add object to book list
  existingBookList.push(bookObject);
  console.log(existingBookList);
  
  //commit all back to local storage
  localStorage.setItem("BookList", JSON.stringify(existingBookList));

  //update the book list titles list
  const title = existingBookList[existingBookList.length - 1 || 0].volumeInfo.title
  console.log(title);

  bookListTitles.push(title);
  localStorage.setItem("BookListTitles", JSON.stringify(bookListTitles));
  console.log(bookListTitles);
});

function populateBooklistDropdown() {
  const bookList = JSON.parse(localStorage.getItem("BookList"));
  const menuDropdown = document.getElementsByClassName("navbar")[0].getElementsByClassName("dropdown-content")[0];

  for (let i = 0; i < bookList.length; i++) {
    let newA = document.createElement("a");
    newA.innerHTML = bookList[i].volumeInfo.title;
    newA.setAttribute("data-id", i);
    menuDropdown.appendChild(newA);

    let newDropdownItem = menuDropdown.getElementsByTagName("a")[i];
    // opens popup for selected title
    newDropdownItem.addEventListener("click", e => {
      const content = JSON.parse(localStorage.getItem("BookList"));
      const contentIndex = e.path[0].getAttribute("data-id");
      const contentVolumeInfo = content[contentIndex].volumeInfo;
      const image = contentVolumeInfo.imageLinks.thumbnail;
      const popHeader = document.querySelector("[book-title]");
      const popImage = document.querySelector("[book-cover]");
      const popDesc = document.querySelector("[book-desc]")
      const popAuthor = document.querySelector("[author]")
      const popPublishedDate = document.querySelector("[published]")
      const popPublisher = document.querySelector("[publisher]")
      const popCategory = document.querySelector("[categories]")
      const bookIdentifier = document.querySelector("[book-identifier]");
      const bookListTitles = JSON.parse(localStorage.getItem("BookListTitles"));
      const toBookListButton = document.getElementById("save-to-booklist");
      popHeader.textContent = contentVolumeInfo.title;
      popDesc.textContent = contentVolumeInfo.description;
      popImage.style.background = `url(${image}) no-repeat center center`;
      popAuthor.textContent = `Author: ${contentVolumeInfo.authors}`;
      popPublishedDate.textContent = `Date Published: ${contentVolumeInfo.publishedDate}`;
      popPublisher.textContent = `Published By: ${contentVolumeInfo.publisher}`;
      popCategory.textContent = `Print Type: ${contentVolumeInfo.printType}`;
      bookIdentifier.textContent = contentIndex;

      //add appropriate link to googlebooks button
      const viewOnGoogle = document.getElementById("google");
      viewOnGoogle.setAttribute("href", contentVolumeInfo.canonicalVolumeLink);
      viewOnGoogle.setAttribute("target", "_blank");

      //make the to booklist button green if this title is already saved to it
      for (let i = 0; i < bookListTitles.length; i++) {
        if (bookListTitles[i] === contentVolumeInfo.title) {
          document.getElementById("save-to-booklist").classList.add("saved");
          toBookListButton.innerHTML = '<i class="fa-solid fa-circle-check"></i> Booklist';
        }
      }

      popup.classList.add("active");
      popupOverlay.classList.add("active");

    })
  }
}

//populates booklist on page reload
window.addEventListener("load", populateBooklistDropdown);

//----------------------------------UTILITY FUNCTIONS----------------------------------------

function removeListDuplicates(list) {
  let unique = [...new Set(list)]
  return unique
}