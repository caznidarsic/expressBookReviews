const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post('/register', function (req, res) {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      return res.status(400).send(JSON.stringify({ message: `there is already a user with username ${username}` }));
    }
    users.push({ "username": username, "password": password });
    return res.status(200).send(JSON.stringify({ message: `the user ${username} has been successfully registered` }))
  }
  else {
    return res.status(400).send(JSON.stringify({ message: 'not enough information provided, could not register user' }))
  }
})

// Asynchronous function to simulate fetching the books from a remote server
async function fetchBooks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books)
    }, 2000)
  })
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    let fetchedBooks = await fetchBooks();
    res.status(200).send(JSON.stringify(fetchedBooks, null, 4));
  }
  catch (err) {
    return res.status(500).send(JSON.stringify({ message: `error fetching data` }));
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    let fetchedBooks = await fetchBooks();
    let isbn = req.params.isbn;
    let filteredBooks = {};
    filteredBooks[isbn] = fetchedBooks[isbn];
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }
  catch (err) {
    return res.status(500).send(JSON.stringify({ message: `error fetching data` }));
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    let fetchedBooks = await fetchBooks();
    let author = req.params.author;
    let filteredBooks = {};
    for (const key in fetchedBooks) {
      if (fetchedBooks[key].author === author) {
        filteredBooks[key] = fetchedBooks[key];
      }
    }
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }
  catch (err) {
    return res.status(500).send(JSON.stringify({ message: `error fetching data` }));
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    let fetchedBooks = await fetchBooks();
    let title = req.params.title;
    let filteredBooks = {};
    for (const key in fetchedBooks) {
      if (fetchedBooks[key].title === title) {
        filteredBooks[key] = fetchedBooks[key];
      }
    }
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }
  catch (err) {
    return res.status(500).send(JSON.stringify({ message: `error fetching data` }));
  }


});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let filteredBooks = {};
  let book = books[isbn];
  if (book) {
    filteredBooks[isbn] = book.reviews;
  }
  return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

module.exports.general = public_users;
