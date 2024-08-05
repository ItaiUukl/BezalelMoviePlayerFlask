let moviesDict = {};


const fetchMovies = async () => {
  const res = await fetch('/movies')
  moviesDict = await res.json()
};

const playMovie = function (name) {
  const videoNode = document.querySelector('video')

  videoNode.src = moviesDict[name]["url"];
};


const localFileVideoPlayer = async () => {
    const moviePicked = function (event) {
        playMovie(this.value);
    };

    await fetchMovies()

    const moviePicker = document.querySelector('select.picker')
    for (let key in moviesDict) {
        let opt = document.createElement('option');
        opt.value = key;
        opt.innerHTML = key;
        moviePicker.appendChild(opt);
    }
    moviePicker.addEventListener('change', moviePicked, false)

};

localFileVideoPlayer().then()
