//card variables
const searchButton = document.getElementById("search-btn");
let searchFieldToggle = document.getElementById("toggle-btn");

//set params of the search URL
function advancedSearch() {
  const generalSearchInput = document.getElementById("search").value;
  const titleSearchInput = document.getElementById("search-title").value;
  const authorSearchInput = document.getElementById("search-author").value;
  const subjectSearchInput = document.getElementById("search-subject").value;
  const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?`);

  endpoint.searchParams.set("q", generalSearchInput);
  endpoint.searchParams.set("intitle", titleSearchInput);
  endpoint.searchParams.set("inauthor", authorSearchInput);
  endpoint.searchParams.set("subject", subjectSearchInput);
  endpoint.searchParams.set("maxResults", 40);
  endpoint.searchParams.set("langRestrict", "en");

  return endpoint
}

//query the google books api and return results based on user input
async function performApiQuery() {
  const endpoint = advancedSearch();
  console.log(endpoint);

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
    const bookCardTemplate = document.querySelector("#book-card-template");
    const bookCardContainer = document.querySelector("#book-cards-container");  
    const card = bookCardTemplate.content.cloneNode(true).children[0];
    const bookCover = card.querySelector("[book-cover]");
    const bookTitle = card.querySelector("[book-title]");
    const bookAuthor = card.querySelector("[book-auth]");
  
    bookCover.style.background = `url(${list[i]}) no-repeat center center`;
    bookTitle.textContent = dataVolumeInfo.title;
    bookAuthor.textContent = dataVolumeInfo.authors;
    bookCardContainer.append(card);
    //needed to generate event listeners on each card button
    cardButtons = card.querySelectorAll("[data-popup-target]");
    cardButtons.forEach(button => {
      button.addEventListener("click", () => {
        const target = document.querySelector(button.dataset.popupTarget);
        openPopUp(target);
      })
    })
  }
}

// Display/hide extra search input options with a toggle button
searchFieldToggle.addEventListener("click", () => {
  let toggle = document.getElementById("toggle-hidden");
  let search = document.getElementById("search");
  
  if (searchFieldToggle.value === "More Search Options") {
    toggle.style.display = "block";
    search.style.display = "none";
    searchFieldToggle.value = "Less Search Options";
  } 
  
  else {
    toggle.style.display = "none";
    search.style.display = "block";
    searchFieldToggle.value = "More Search Options";
  }
})

//PERFORM THE SEARCH
searchButton.addEventListener("click", () => {
  const generalSearchInput = document.getElementById("search").value;
  performApiQuery(generalSearchInput);
  saveSearchHistory();
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
function openPopUp (target) {
  if (target == null) return
  popup.classList.add("active");
  popupOverlay.classList.add("active");
}
 
function closePopUp (target) {
  if (target == null) return
  popup.classList.remove("active");
  popupOverlay.classList.remove("active");
}

//popup event listeners
openPopupButtons.forEach(button => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.popupTarget);
    openPopUp(target);
  })
})

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

  //commit all to back to local storage
  localStorage.setItem("History", JSON.stringify(existingHistory));

}