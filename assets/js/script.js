//card variables
const generalSearchInput = document.querySelector("#search");
let generalInputValue = "";
const searchButton = document.getElementById("search-btn");
const bookCardTemplate = document.querySelector("#book-card-template");
const bookCardContainer = document.querySelector("#book-cards-container");  

let searchFieldToggle = document.getElementById("toggle-btn");

const titleSearchInput = document.querySelector("#search-title").value;
const authorSearchInput = document.querySelector("#search-author").value;
const subjectSearchInput = document.querySelector("#search-subject").value;

//input event listeners
generalSearchInput.addEventListener("input", e => {
  const value = e.target.value;
  generalInputValue = value;
})


//query the google books api and return results based on user input
async function performApiQuery(searchValue) {

  if (searchValue === '') {
    alert('Please enter a valid search term') 
    return;
  }

  const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${searchValue}&maxResults=40&projection=lite`);
  console.log(endpoint);
  //console.log(`You generated the following URL: ${endpoint}`);

  const response = await fetch(endpoint);
  const data = await response.json();
  console.log(data);
  const list = generateImageList(data);
  //console.log(list);
  generateHTMLCards(data, list);
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
  console.log(`image urls: ${imageUrls}`);
  return imageUrls;
}


//generate populated cards to display results below search bar
function generateHTMLCards(data, list) {
  for (let i = 0; i < data.items.length; i++) {
    const dataVolumeInfo = data.items[i].volumeInfo;
    const card = bookCardTemplate.content.cloneNode(true).children[0];
    const bookCover = card.querySelector("[book-cover]");
    const bookTitle = card.querySelector("[book-title]");
    const bookAuthor = card.querySelector("[book-auth]");
    bookCover.style.background = `url(${list[i]}) no-repeat center`;
    bookTitle.textContent = dataVolumeInfo.title;
    bookAuthor.textContent = dataVolumeInfo.authors;
    bookCardContainer.append(card);
  }
}

// Display/hide extra search input options with a toggle button
searchFieldToggle.addEventListener("click", () => {
  var toggle = document.getElementById("toggle-hidden");
  
  if (searchFieldToggle.value === "More Search Options") {
    toggle.style.display = "block";
    searchFieldToggle.value = "Less Search Options";
  } 
  
  else {
    toggle.style.display = "none";
    searchFieldToggle.value = "More Search Options";
  }
})

searchButton.addEventListener("click", () => {
  performApiQuery(generalInputValue);
});

//pop-up variables
const openPopupButtons = document.querySelectorAll("[data-popup-target]");
const closePopupButtons = document.querySelectorAll("[data-close-button]");
const popupOverlay = document.getElementById('popup-bg');

//popup functions

function openPopUp (popup) {
  if (popup == null) return
  popup.classList.add("active");
  popupOverlay.classList.add("active");
}

function closePopUp (popup) {
  if (popup == null) return
  popup.classList.remove("active");
  popupOverlay.classList.remove("active");
}

//popup event listeners
openPopupButtons.forEach(button => {
  button.addEventListener("click", () => {
    const popup = document.querySelector(button.dataset.popupTarget);
    openPopUp(popup);
  })
})

closePopupButtons.forEach(button => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup"); //checks for the closest parent of a button element with class pop-up
    closePopUp(popup);
  })
})
