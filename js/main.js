$(document).ready(function() {
  $('#search-form').on("submit", function(e){
    let searchText = $("#search-text").val();
    getMovies(searchText);
    e.preventDefault();
  })
})


function getMovies(searchText){
  axios.get('http://www.omdbapi.com?s='+searchText)
    .then((response) => {
      console.log(response);
      let movies = response.data.Search;
      let output = '';
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${movie.Poster}">
              <h5>${movie.Title}</h5>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-info" href="#">Movie Info</a>
            </div>
          </div>
        `;
      });

      $('#movies').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id) {
  sessionStorage.setItem("movieId",id);
  window.location = "movie.html";
  return false;
}

function getMovie(){
  let movieId= sessionStorage.getItem('movieId');
  let addButton = `<a class="btn btn-warning" onclick="addToFavorites('${movieId}')">Add to favorites <i class="fa fa-star" aria-hidden="true"></i></a>`;
  let removeButton = `<a onclick="removeFavorite('${movieId}')" class="btn btn-danger" href="#">Remove <i class="fa fa-star" aria-hidden="true"></i></a>`;
  let currentButton = "";
  if (inFavorites(movieId)){
    currentButton = removeButton;
  }
  else {
    currentButton= addButton;
  }
  console.log(currentButton);
  console.log(movieId);
  axios.get('http://www.omdbapi.com?i='+movieId)
    .then((response) => {
      let movie = response.data;
      let output= `
      <div class="row">
        <div class="col-md-4">
          <img src="${movie.Poster}" class="thumbnail"></img>
        </div>
        <div class="col-md-8">
          <h2>${movie.Title}</h2>
          <ul class="list-group">
            <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
            <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
            <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
            <li class="list-group-item"><strong>IMBD Rating:</strong> ${movie.imdbRating}</li>
            <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
            <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
            <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
          </ul>
        </div>
      </div>
      <div class="row">
        <div class="well">
          <h3>Plot</h3>
          <p>${movie.Plot}</p>
          <hr>
          <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">Open in IMDB</a>
          ${currentButton}
          <a href="index.html" class="btn btn-default">Back to Search</a>

        </div>
      </div>

      `;

      $("#movie").html(output);
    })
    .catch((err) => {
      console.log("error");
    });
}

function inFavorites(movieId){
  let favorites = JSON.parse(localStorage.getItem("favorites"));
  for (let i in favorites){
    if(favorites[i]===movieId){
      return true;
    }
  }
  return false;
}

function getFavorites(){
  let output = "";
  if (localStorage.getItem("favorites")!=null){
    let favorites=JSON.parse(localStorage.getItem("favorites"));
    console.log(favorites);
    if(favorites.length==0){
      output +=`
      <div class="col-md-8 col-md-offset-2">
        <div class="well text-center">
          <h3> No Movies In favorites</h3>
        </div>
      </div>
      `;
      $("#favorites").html(output);
    }
    else{
    $.each(favorites, function(index,movieId){
      axios.get('http://www.omdbapi.com?i='+movieId)
        .then((response) => {
          let movie= response.data;
          output += `
            <div class="col-md-3">
              <div class="well text-center">
                <img src="${movie.Poster}">
                <h5>${movie.Title}</h5>
                <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-info" href="#">Movie Info</a>
                <a onclick="removeFavorite('${movie.imdbID}')" class="btn btn-danger" href="#">Remove</a>
              </div>
            </div>
          `;
            $('#favorites').html(output);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  }
  }
}
function removeFavorite(movieId){
  let favorites= JSON.parse(localStorage.getItem("favorites"));
  for (let i in favorites){
    if (favorites[i]===movieId){
      if(favorites.length >1){
        favorites.splice(i,1);
      }
      else{
        favorites.splice(i,1);
        console.log(favorites);
      }
      localStorage.setItem("favorites",JSON.stringify(favorites));
      break;
    }
  }
  location.reload();
}
function addToFavorites(movieId){
  console.log(movieId);
  if (localStorage.getItem("favorites")===null){
    let favorites = [];
    favorites.push(movieId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
    else {
      let favorites = JSON.parse(localStorage.getItem("favorites"));
      for (let i in favorites){
        if(favorites[i]===movieId){
          return false;
        }
      }
      favorites.push(movieId);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      location.reload();
      return true;
    }

}
