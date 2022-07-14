// const bookCardTemplate = document.querySelector("[book-card-template]");

// console.log(fetchData);

  // const card = bookCardTemplate.content.cloneNode(true).children[0]
  // console.log(card);

  const userInput = document.getElementById("search");
  const button = document.getElementById("search-button");

  //query the google books api and return result
  async function getBooks (searchInput) {
    // const search = "harry+potter"

    if (!searchInput) {
      alert('Please enter a book title') 
      return;
    }

    const endpoint = new URL(`https://www.googleapis.com/books/v1/volumes?q=${searchInput}`);
    console.log(endpoint);
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log(data);
    return data

  }

  button.addEventListener("click", () => {
    getBooks(userInput.value);
  })
