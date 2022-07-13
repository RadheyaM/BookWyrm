const bookCardTemplate = document.querySelector("[book-card-template]");

fetch("https://www.googleapis.com/books/v1/volumes?q=harry+potter")
  .then(res => res.json())
  .then(data => console.log(data))


  // const card = bookCardTemplate.content.cloneNode(true).children[0]
  // console.log(card);