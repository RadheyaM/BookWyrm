// const bookCardTemplate = document.querySelector("[book-card-template]");

// console.log(fetchData);

  // const card = bookCardTemplate.content.cloneNode(true).children[0]
  // console.log(card);

  const userInput = document.getElementById("search");
  const button = document.getElementById("search-button");
  let responseData = {};

  //query the google books api and return results based on user input
  async function getBooks (searchInput) {

    if (searchInput === '') {
      alert('Please enter a book title') 
      return;
    }

    const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);
    console.log(endpoint);
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(data);
    responseData = data;

  }

  button.addEventListener("click", () => {
    getBooks(userInput.value);
  })
