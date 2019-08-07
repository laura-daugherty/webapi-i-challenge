// implement your API here
// // implement your API here
// Inside `index.js` add the code necessary to implement the following _endpoints_:

// | Method | URL            | Description                                                                                                                       |
// | ------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
// | POST   | /api/users     | Creates a user using the information sent inside the `request body`.                                                              |
// | GET    | /api/users     | Returns an array of all the user objects contained in the database.                                                               |
// | GET    | /api/users/:id | Returns the user object with the specified `id`.                                                                                  |
// | DELETE | /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                                                            |
// | PUT    | /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**. |


//import express//
const express = require('express');

//import db.js

const Chars = require('./data/db.js');

//server is invoking an express...function?
const server = express();

server.use(express.json())
//tells express to start reading JSON

// '/' is the default - we don't want anything to really happen there
server.get('/', (req, res) => {
  res.send('Nothing, you are looking at /')
});

//See a list of users
server.get('/api/users', (req, res) => {
  // if (!res) {
  //   return res.status(500).json({ error: "The users information could not be retrieved." }) 
  // }
  Chars.find()
    .then(charsRes => {
      res.status(200).json(charsRes);
      return charsRes
      // console.log("charRes", charsRes)
    })
    .catch(error => {
      res.status(500).json({ error: "The users information could not be retrieved." })
    })
})
console.log(charsRes)

//Create a users
server.post('/api/users', (req, res) => {
  const { name, bio } = req.body;

  if (!name || !bio) {
    return res.status(400).json({ message: "Please provide name and bio for the user"})
  }

  Chars.insert(req.body)
    .then(char => {
      res.status(200).json(char);
    })
    .catch(error => {
      res.status(500).json({ 
        message: 'error adding the character',
        error
      })
    })
})

//Get user with ID

server.get('/api/users/:id', (req, res) => {
  console.log( "get user by id req ", req.params)
  console.log( "get user by id res ", res)

  const id = req.params.id
  Chars.findById(id)
  .then ( result => {
    if (result) {
      return res.status(200).json(result)
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
    
  })
  .catch ( error => {
    res.status(500).json({error: "The user information could not be retrieved."})
  })
})

server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id
  // const findChar = (char) => {
  //   return char.id === id
  // }
  // const thisChar = Chars.find(findChar);
  // console.log("char", thisChar)
  console.log("Delete Chars", Chars)
  // const thisChar = Chars.filter((char)=> {
  //   char.id === id
  // })
  // console.log("this Char filter", thisChar)

  Chars.remove(id) 
  .then(response => {
    if(response > 0) {
      console.log(req.params)
      return res.status(200).json(response)
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
  })
  .catch( error => {
    res.status(500).json({ error: "The user could not be removed" })
  })
})


server.put('/api/users/:id', (req, res) => {
  const id = req.params.id
  const { name, bio } = req.body;

  const char = Chars.find(c => c.id == id);

  Chars.update( id, req.body )

  .then(response => {
    console.log("response", response)
    //because response is a number we are comparing to a number
    if(response === 0 ){
      res.status(404).json({message: "The user with the specified ID does not exist."})
    } if (!name || !bio) {
      res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    } else {
      Object.assign(char, req.body);
      res.status(200).json({message: "it works!"})
      console.log("Object", Object.assign)                                                                                                                                                                                                                                                          
    }
  })
  .catch(error => {
    res.status(500).json({error: "The user information could not be modified."})
  })
})



const port = 8000;
server.listen(port, () => console.log('api running'))

