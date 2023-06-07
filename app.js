const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//1
app.get("/movies", async (request, response) => {
  const allMovies = `
    SELECT 
    * 
    FROM
    movie
    ORDER BY 
    movie_id; `;
  const dbResponse = await db.all(allMovies);
  response.send(dbResponse);
});

//2
app.post("/movies", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovie = `
    INSERT INTO 
    movie (director_id,movie_name,lead_actor)
    VALUES
      (
        ${directorId},
         ${movieName},
         ${leadActor},
      );`;
  const dbResponse = await db.run(addMovie);
  response.send("Movie Successfully Added");
});

//3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovie = `
    SELECT
      *
    FROM
      movie
    WHERE
      movie_id = ${movieId};`;
  const dbResponse = await db.get(getMovie);
  response.send(dbResponse);
});

//4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateMovie = `
    UPDATE
      movie
    SET
      director_id= '${directorId}',
      movie_name= '${movieName}',
      lead_actor= '${leadActor}',
    WHERE
      movie_id = ${movieId};`;
  const dbResponse = await db.run(updateMovie);
  response.send("Movie Details Updated");
});

//5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovie = `
     DELETE FROM
      movie
    WHERE
      movie_id = ${movieId};`;
  const dbResponse = await db.run(deleteMovie);
  response.send("Movie Removed");
});

//6
app.get("/directors/", async (request, response) => {
  const getDirectors = `
    SELECT
      *
    FROM
      director`;
  const dbResponse = await db.all(getDirectors);
  response.send(dbResponse);
});

//7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getAllMovies = `
    SELECT
     movie.movie_name
    FROM
     movie
     INNER JOIN director ON director.director_id = movie.director_id;
    GROUP BY
      movie.director_id = '${directorId}';`;
  const dbResponse = await db.all(getAllMovies);
  response.send(dbResponse);
});
