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
    for (const user of users) {
      if (user.username === username) {
        return res.status(400).send(JSON.stringify({ message: `there is already a user with username ${username}` }));
      }
    }
    users.push({ "username": username, "password": password });
    return res.status(200).send(JSON.stringify({ message: `the user ${username} has been successfully registered` }))
  }
  else {
    return res.status(400).send(JSON.stringify({ message: 'not enough information provided, could not register user' }))
  }
})

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  let filteredBooks = {};
  filteredBooks[isbn] = books[isbn];
  return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let filteredBooks = {};
  for (const key in books) {
    if (books[key].author === author) {
      filteredBooks[key] = books[key];
    }
  }
  return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  let filteredBooks = {};
  for (const key in books) {
    if (books[key].title === title) {
      filteredBooks[key] = books[key];
    }
  }
  return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
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
