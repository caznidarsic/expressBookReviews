const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username": "abcd", "password": "123" }];

const isValid = (username) => {
  for (const user of users) {
    if (user.username === username) {
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username, password) => { //returns boolean
  let filteredUsers = users.filter((user) => {
    return user.username === username;
  })
  if (filteredUsers.length > 0 && filteredUsers[0].password === password) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(400).send(JSON.stringify({ message: 'Not enough inputs to login user' }));
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send(JSON.stringify({ message: `User ${username} successfully logged in!` }));
  }
  else {
    return res.status(400).send(JSON.stringify({ message: 'Provided credentials are not correct' }));
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (!book) {
    return res.status(400).send(JSON.stringify({ message: `No book found with isbn: ${isbn}` }));
  }
  let review = req.query.review;
  if (!review) {
    return res.status(400).send(JSON.stringify({ message: 'No review provided' }));
  }
  let username = req.session.authorization.username;
  if (!username) {
    return res.status(400).send(JSON.stringify({ message: 'Could not add review' }));
  }
  let reviews = book.reviews;
  reviews[username] = review;
  return res.status(200).json({ message: "Review successfully added" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if (!book) {
    return res.status(400).send(JSON.stringify({ message: `No book found with isbn: ${isbn}` }));
  }
  let username = req.session.authorization.username;
  if (!username) {
    return res.status(400).send(JSON.stringify({ message: 'Could not add review' }));
  }
  let review = book.reviews[username];
  if (!review) {
    return res.status(400).send(JSON.stringify({ message: `No reviews found for user ${username} and book with isbn ${isbn}` }));
  }
  delete book.reviews[username];
  console.log(book.reviews);
  return res.status(200).send(JSON.stringify({ message: `Review for book with isbn ${isbn} successfully deleted` }));
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
