  const userInput = document.getElementById("search");
  const searchButton = document.getElementById("search-btn");
  let searchFieldToggle = document.getElementById("toggle-btn");
  const bookCardTemplate = document.querySelector("#book-card-template");
  const bookCardContainer = document.querySelector("#book-cards-container");  


  //query the google books api and return results based on user input
  async function getBooks (searchInput) {

    if (searchInput === '') {
      alert('Please enter a book title') 
      return;
    }

    const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}&maxResults=10`);
    console.log(`You generated the following URL: ${endpoint}`);

    const response = await fetch(endpoint);
    const data = await response.json();
    console.log("Your fetch request returned:")
    console.log(data);


    //generate a list of image source pathways
    let imageUrls = [];
    for (let i = 0; i < data.items.length; i++) {
      imageUrls.push(data.items[i].volumeInfo.imageLinks.thumbnail);
    }

    //generate populated cards to display below search bar.
    for (let i = 0; i < data.items.length; i++) {
      const dataVolumeInfo = data.items[i].volumeInfo;
      const card = bookCardTemplate.content.cloneNode(true).children[0];
      const bookCover = card.querySelector("[book-cover]");
      const bookTitle = card.querySelector("[book-title]");
      const bookAuthor = card.querySelector("[book-auth]");
      
      bookCover.style.background = `url(${imageUrls[i]}) no-repeat center`;
      console.log(imageUrls[i]);
      bookTitle.textContent = dataVolumeInfo.title;
      bookAuthor.textContent = dataVolumeInfo.authors;
      bookCardContainer.append(card);
    }


  }

// Display/hide extra search input options on click. 
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
  getBooks(userInput.value);
  //renderDataToCards(responseData);
})
