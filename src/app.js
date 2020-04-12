const express = require("express");
const cors = require("cors");
const { uuid,isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// IsUuid? - Middleware
function validateID(req,res,next) {
  
  const { id } = req.params
  
  if(!isUuid(id))
  return res.status(400).json({erro:'Invalid repository ID'})
  
  return next()
}

// Where's my repository? - Middleware
function findRepositoryIndex(req,res,next) {

  const { id } = req.params

  res.locals.repositoryIndex = repositories.findIndex(obj => obj.id === id)

  if(res.locals.repositoryIndex < 0)
  return res.status(400).json({erro:'Repository Not Found'})
  
  return next()
}

app.use("/repositories/:id", validateID, findRepositoryIndex)

// List
app.get("/repositories", (req, res) => {
  return res.json(repositories)
});

// Create
app.post("/repositories", (req, res) => {

  const { title,url,techs } = req.body
  const repository = {id:uuid(),title,url,techs,likes:0}
  repositories.push(repository)

  return res.json(repository)
});

// Update
app.put("/repositories/:id", (req, res) => {
  
  const { id } = req.params
  const { title,url,techs } = req.body

  const repository = {
    id,
    title,
    url,
    techs,
    likes:repositories[res.locals.repositoryIndex].likes
  }
  
  repositories[res.locals.repositoryIndex] = repository

  return res.json(repository)
});

// Delete
app.delete("/repositories/:id", (req, res) => {

  repositories.splice(res.locals.repositoryIndex,1)

  return res.status(204).send();
});

// Like increase
app.post("/repositories/:id/like", (req, res) => {

  repositories[res.locals.repositoryIndex].likes ++

  return res.status(200).json(repositories[res.locals.repositoryIndex])
});

module.exports = app;