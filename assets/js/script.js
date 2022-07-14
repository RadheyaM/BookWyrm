  const userInput = document.getElementById("search");
  const button = document.getElementById("search-button");
  const bookCardTemplate = document.querySelector("#book-card-template");
  const bookCardContainer = document.querySelector("#book-cards-container");  
  //let responseData = {};

  //query the google books api and return results based on user input
  async function getBooks (searchInput) {

    if (searchInput === '') {
      alert('Please enter a book title') 
      return;
    }

    const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);
    console.log(`You generated the following URL: ${endpoint}`);

    const response = await fetch(endpoint);
    const data = await response.json();
    console.log("Your fetch request returned: ----------- ")
    console.log(data);

    //generate populated cards to display below search bar.
    for (let i = 0; i < data.items.length; i++) {
      console.log(data.items[i].volumeInfo.title)
      const card = bookCardTemplate.content.cloneNode(true).children[0];
      const bookTitle = card.querySelector("[book-title]");
      const bookDesc = card.querySelector("[book-desc]");
      bookTitle.textContent = data.items[i].volumeInfo.title;
      bookDesc.textContent = data.items[i].volumeInfo.description;
      bookCardContainer.append(card);
    }


  }

button.addEventListener("click", () => {
  const responseData = getBooks(userInput.value);
  //renderDataToCards(responseData);
})
