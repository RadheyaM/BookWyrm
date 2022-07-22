//card variables
const searchButton = document.getElementById("search-btn");
const showHistory = document.getElementById("show-history");
let searchFieldToggle = document.getElementById("toggle-btn");

//query the google books api and return results based on user input
async function performApiQuery() {
  const generalSearchInput = document.getElementById("search").value;

  const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${generalSearchInput}&maxResults=40&langRestrict=en`);

  const response = await fetch(endpoint);
  const data = await response.json();
  // console.log(data);
  localStorage.setItem("lastSearch", JSON.stringify(data));
  //console.log(localStorage.getItem("lastSearch"));
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
    //if the image url is missing then add placeholder image to the list
    else {
      imageUrls.push("assets/images/bookcover-placeholder.jpg");
    }
  }
  //console.log(`image urls: ${imageUrls}`);
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
//PERFORM THE SEARCH
searchButton.addEventListener("click", () => {
  const generalSearchInput = document.getElementById("search").value;
  const refreshButton = document.getElementById("refresh")
  performApiQuery(generalSearchInput);
  saveSearchHistory();
  //delay the appearance of the refresh button
  setTimeout(() => {
    refreshButton.classList.remove("hidden");
  }, 1000);
});

const refresh = document.getElementById("refresh");
refresh.addEventListener("click", () => {
  location.reload();
})

//pop-up variables
const openPopupButtons = document.querySelectorAll("[data-popup-target]");
const closePopupButtons = document.querySelectorAll("[data-close-button]");
const popupOverlay = document.getElementById("popup-bg");

//popup functions
//opens and populates the popup window
function openPopUp (target) {
  if (target == null) return

  const content = JSON.parse(localStorage.getItem("lastSearch"));
  console.log(content);
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
  popHeader.textContent = contentVolumeInfo.title;
  popDesc.textContent = contentVolumeInfo.description;
  popImage.style.background = `url(${imageList[contentIndex]}) no-repeat center center`;
  popAuthor.textContent = `Author: ${contentVolumeInfo.authors}`;
  popPublishedDate.textContent = `Date Published: ${contentVolumeInfo.publishedDate}`;
  popPublisher.textContent = `Published By: ${contentVolumeInfo.publisher}`;
  popCategory.textContent = `Genres: ${contentVolumeInfo.Categories}`;
  bookIdentifier.textContent = contentIndex;


  popup.classList.add("active");
  popupOverlay.classList.add("active");
}
 
function closePopUp (target) {
  if (target == null) return
  popup.classList.remove("active");
  popupOverlay.classList.remove("active");
}

closePopupButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.closest(".popup"); //checks for the closest parent of a button element with class pop-up
    closePopUp(target);
  })
})

//Keep a search history record using local storage
function saveSearchHistory(){
  const searchInput = document.getElementById("search").value;

  //create an History item if none exists yet
  if (localStorage.getItem("History") == null) {
    localStorage.setItem("History", "[]");
  }

  //add the search input to local storage History item
  const existingHistory = JSON.parse(localStorage.getItem("History"));
  existingHistory.push(searchInput);

  //commit all back to local storage
  localStorage.setItem("History", JSON.stringify(existingHistory));
}

// Perform search upon hitting enter in the input box
const searchBar = document.getElementById("search");
searchBar.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    document.getElementById("search-btn").click();
  }
});

// reveal dropdown of search history
showHistory.addEventListener("click", e => {
  //get history reversed so most recent search is displayed first
  const history = JSON.parse(localStorage.getItem("History")).reverse();
  const menuUl = document.getElementById("nav-bar").getElementsByTagName("ul")[1];

  for (let i = 0; i < history.length || i > 15; i++) {
    let newLi = document.createElement("li");
    let searchBar = document.getElementById("search");
    menuUl.appendChild(newLi);

    //add new li element to history ul
    let newMenuLi = menuUl.getElementsByTagName("li")[i];
    newMenuLi.textContent = history[i];

    // when new li clicked a search is initiated
    newMenuLi.addEventListener("click", e => {
      searchBar.value = e.path[0].innerHTML;
      searchButton.click()
    });
  }
}, { once: true}); 

//Allow the user to save a particular book to a list
const saveBook = document.getElementById("save-to-booklist");
saveBook.addEventListener("click", e => {
  console.log(e.path);
  const bookId = document.querySelector("[book-identifier]").innerHTML;
  const bookObject = JSON.parse(localStorage.getItem("lastSearch")).items[bookId];

  //create a book list item if none exists yet
  if (localStorage.getItem("BookList") == null) {
    localStorage.setItem("BookList", "[]");
  }

  //add the book corresponding to selected popup preview button
  const existingBookList = JSON.parse(localStorage.getItem("BookList"));
  existingBookList.push(bookObject);

  //commit all back to local storage
  localStorage.setItem("BookList", JSON.stringify(existingBookList));
});