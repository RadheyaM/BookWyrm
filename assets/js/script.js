let userInput = document.querySelector("#search");
let userInputValue = "";
const searchButton = document.getElementById("search-btn");
const bookCardTemplate = document.querySelector("#book-card-template");
const bookCardContainer = document.querySelector("#book-cards-container");  

let searchFieldToggle = document.getElementById("toggle-btn");

userInput.addEventListener("input", e => {
  const value = e.target.value;
  userInputValue = value;
})

//query the google books api and return results based on user input
async function performApiQuery(searchValue) {

  if (searchValue === '') {
    alert('Please enter a valid search term') 
    return;
  }

  const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${searchValue}&maxResults=40&projection=lite`);
  console.log(`You generated the following URL: ${endpoint}`);

  const response = await fetch(endpoint);
  const data = await response.json();
  console.log(data);
  const list = generateImageList(data);
  //console.log(list);
  generateHTMLCards(data, list);
}

//generate a list of image source pathways
function generateImageList(data) {
  let imageUrls = [];
  for (let i = 0; i < data.items.length; i++) {
    //prevent uncaught type-error due to missing image link
    if (data.items[i].volumeInfo.imageLinks !== undefined) {
      imageUrls.push(data.items[i].volumeInfo.imageLinks.thumbnail);
    }
    else {
      imageUrls.push("assets/images/bookcover-placeholder.jpg");
    }
  }
  console.log(`image urls: ${imageUrls}`);
  return imageUrls;
}


  //generate populated cards to display below search bar.
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

// Display/hide extra search input options 
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
  performApiQuery(userInputValue);
});
