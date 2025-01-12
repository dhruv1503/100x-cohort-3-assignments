// You have to create a middleware for rate limiting a users request based on their username passed in the header

const express = require('express');
const app = express();

// Your task is to create a global middleware (app.use) which will
// rate limit the requests from a user to only 5 request per second
// If a user sends more than 5 requests in a single second, the server
// should block them with a 404.
// User will be sending in their user id in the header as 'user-id'
// You have been given a numberOfRequestsForUser object to start off with which
// clears every one second

let numberOfRequestsForUser = {};
setInterval(() => {
    numberOfRequestsForUser = {};
}, 1000)

const checkHeaders = (request, response, next) => {
  const userId = request.headers["user-id"]
  if(!userId) return response.status(403).json({message : "User is not allowed"})
  next()
}
const addUserNameToQueue = (request, response, next) => {
  const userId = request.headers["user-id"];
  if(!Object.keys(numberOfRequestsForUser).includes(userId)){
    numberOfRequestsForUser[`${userId}`] = 1
  }
  else{
    const count = numberOfRequestsForUser[`${userId}`] 
    numberOfRequestsForUser[`${userId}`] = count + 1;
  }
  next()
}
const rateLimiter = (request, response, next) => {
  const userId = request.headers["user-id"];
  if(Object.keys(numberOfRequestsForUser).includes(userId) && numberOfRequestsForUser[`${userId}`] > 5) return response.status(404).json({message : "Too much requests!"})
    next()
}
app.use(checkHeaders)
app.use(addUserNameToQueue);
app.use(rateLimiter)
app.get('/user', function(req, res) {
  const userId = req.headers["user-id"];
  console.log("request made by " + userId)
  res.status(200).json({ name: userId });
});

app.post('/user', function(req, res) {
  res.status(200).json({ msg: 'created dummy user' });
});

// app.listen(3000, () => {
//   try{
//     console.log(`Server is running on 3000...`)
//   }
//   catch(error){
//     console.log(error)
//   }
// })

module.exports = app;