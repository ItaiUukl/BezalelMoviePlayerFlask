let moviesDict = {};
let moviesNamesList = [];
let playedMovie = '';
let currentMovieIndex = 0;

/**
 * Fetches all movies urls from the (local) server and updates the inner data accordingly.
 */
const fetchMovies = async () => {
    const res = await fetch('/movies')
    moviesDict = await res.json()
    moviesNamesList = Object.keys(moviesDict).sort(
        (a, b) => moviesDict[a]["movieOrder"].localeCompare(moviesDict[b]["movieOrder"]));
};

/**
 * Plays the given movie from the beginning.
 * @param fileName The name of the movie file (this is how the movies are serialized).
 */
const playMovie = (fileName) => {
    const videoNode = document.getElementById('moviePlayer');
    enterFullScreen();  // In case this the first play.
    if (fileName !== playedMovie) {
        videoNode.src = moviesDict[fileName]["movieURL"];
        playedMovie = fileName;
    }
    videoNode.pause();
    videoNode.currentTime = 0;
    videoNode.play().then(() => videoNode.style.display = 'flex');
    videoNode.addEventListener('ended', playNextMovie);
};

// Ignoring default mouse functionality (right click - contextmenu & middle click - mousedown.button 1.
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('mousedown', (event) => {
    if(event.button === 1){
        event.preventDefault();
    }
});

/**
 * Enters full screen, covering all browsers options (hopefully).
 */
const enterFullScreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }
}

/**
 * Plays the next movie.
 */
const playNextMovie = () => {
    currentMovieIndex = (currentMovieIndex + 1) % moviesNamesList.length;
    playMovie(moviesNamesList[currentMovieIndex])
}

// The main setup of the app, starts on the initial DOM load.
document.addEventListener('DOMContentLoaded', () => {
    // The list of movie links in the sidebar menu
    const moviesList = document.getElementById('moviesList');
    // The container of the sidebar menu
    const menuContainer = document.getElementById('menuContainer');

    // The node that runs all the videos (only source changes).
    const videoNode = document.getElementById('moviePlayer')
    // The node that shows all the movies thumbnails (only source changes).
    const imageNode = document.getElementById('movieImage')

    videoNode.addEventListener("click", event => event.preventDefault())

    /**
     * Changes sidebar menu display (flex(on) <-> none(off))
     */
    const showMenu = () => {
        if (menuContainer.style.display === 'none' || menuContainer.style.display === '') {
            menuContainer.style.display = 'flex';
            videoNode.pause()
            // Reveal cursor with menu
            document.body.classList.remove("noCursor");
        } else {
            menuContainer.style.display = 'none';
            imageNode.style.display = 'none';
            videoNode.style.display = 'block'

            // Hide cursor while menu is hidden
            document.body.classList.add("noCursor");
            videoNode.play().then();
        }
    }
    // Bind mouse clicks to menu change.
    document.body.addEventListener('click', showMenu);
    document.body.addEventListener('contextmenu', showMenu);

    // Sets the current movie thumbnail while cursor is on sidebar menu.
    menuContainer.addEventListener('mouseover', () =>{
        imageNode.style.display = 'block';  // Shows thumbnail
        videoNode.style.display = 'none';  // Hides video
        if (moviesNamesList.length !== 0) {
            let movieName = playedMovie ? playedMovie : moviesNamesList[0];
            imageNode.src = moviesDict[movieName]["imageURL"];
        }
    })
    // Returns to video (paused frame) when cursor leaves sidebar menu.
    menuContainer.addEventListener('mouseleave', (event) => {
        imageNode.style.display = 'none';
        videoNode.style.display = 'block';
    });

    // Ignore click and right click (contextmenu) functions in outer containers
    // (mostly to avoid video receiving the clicks).
    menuContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    menuContainer.addEventListener('contextmenu', event => event.preventDefault());
    menuContainer.addEventListener('contextmenu', (event) => {
        event.stopPropagation();
    });

    /**
     * Manages containers for playing a movie and plays it.
     * @param movieFile The name of the movie file (movie identifier).
     */
    const playMovieOnClick = (movieFile) => {
        menuContainer.style.display = 'none';
        imageNode.style.display = 'none';
        videoNode.style.display = 'block'
        document.body.classList.add("noCursor");
        playMovie(movieFile);
    }

    /**
     * Binds an event on a movie name list item to play the movie.
     * @param liTag The list item tag to bind.
     * @param eventType The type of event to bind to (mostly clicks).
     * @param movieFile The movie file name to play.
     */
    const handleItemClick = (liTag, eventType, movieFile) => {
        liTag.addEventListener(eventType, () => {
            playMovieOnClick(movieFile);
        })
    }

    /**
     * Binds movie name list item to change thumbnail image while on it.
     * @param li The movie name container in the list.
     * @param movieFileName The file name of the movie (movie identifier).
     */
    const handleItemHover = (li, movieFileName) => {
        li.addEventListener('mouseover', (event) => {
            imageNode.style.display = 'block';
            videoNode.style.display = 'none';
            imageNode.src = moviesDict[movieFileName]["imageURL"];
            event.stopPropagation();  // To avoid sidebar container from picking the mouseover function (default thumbnail).
        })
    }

    /**
     * Creates and fills a single list item for the movies sidebar menu (in html context).
     * @param movieFileName The file name for the movie.
     */
    const addListItem = (movieFileName) => {
        const liTag = document.createElement('li');
        const aTag = document.createElement('a');
        const mainSpan = document.createElement('span');
        const secondarySpan = document.createElement('span');

        mainSpan.classList.add('main-text');
        secondarySpan.classList.add('secondary-text');

        mainSpan.textContent = moviesDict[movieFileName]["authorName"];
        secondarySpan.textContent = moviesDict[movieFileName]["movieName"];

        aTag.appendChild(mainSpan);
        aTag.appendChild(secondarySpan);
        liTag.appendChild(aTag);

        handleItemClick(liTag, 'click', movieFileName)
        handleItemClick(liTag, 'contextmenu', movieFileName)
        handleItemHover(liTag, movieFileName)

        moviesList.appendChild(liTag);
    }

    // Populates the list of movies container with the movies info from the server (local).
    fetchMovies().then(() => {
        for (let i = 0; i < moviesNamesList.length; i++) {
            addListItem(moviesNamesList[i]);
        }
    })
});
