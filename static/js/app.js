let moviesDict = {};
let moviesNamesList = [];
let playedMovie = '';
let currMovieIndex = 0;


const fetchMovies = async () => {
    const res = await fetch('/movies')
    moviesDict = await res.json()
    moviesNamesList = Object.keys(moviesDict).sort((a, b) => moviesDict[a]["movieOrder"] - moviesDict[b]["movieOrder"]);
};


const playMovie = function (fileName) {
    const videoNode = document.getElementById('moviePlayer');
    enterFullScreen();
    if (fileName !== playedMovie) {
        videoNode.src = moviesDict[fileName]["movieURL"];
        playedMovie = fileName;
    }
    videoNode.pause();
    videoNode.currentTime = 0;
    videoNode.play().then(() => videoNode.style.display = 'flex');
    videoNode.addEventListener('ended', playNextMovie);
};

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('mousedown', (e) => {
    if(e.button === 1){
        e.preventDefault();
    }
});

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

const playNextMovie = () => {
    currMovieIndex = (currMovieIndex + 1) % moviesNamesList.length;
    playMovie(moviesNamesList[currMovieIndex])
}

document.addEventListener('DOMContentLoaded', () => {
    const myList = document.getElementById('lista');
    const menuContainer = document.getElementById('menuContainer');

    const videoNode = document.getElementById('moviePlayer')
    const imageNode = document.getElementById('movieImage')

    videoNode.addEventListener("click", event => event.preventDefault())

    const showMenu = function () { // function to show/hide menu
        if (menuContainer.style.display === 'none' || menuContainer.style.display === '') {
            menuContainer.style.display = 'flex';
            videoNode.pause()

          document.body.classList.remove("noCursor");
        } else {
            menuContainer.style.display = 'none';
            imageNode.style.display = 'none';
            videoNode.style.display = 'block'

          document.body.classList.add("noCursor");
            videoNode.play().then();
        }
    }
    document.body.addEventListener('click', showMenu);
    document.body.addEventListener('contextmenu', showMenu);

    menuContainer.addEventListener('mouseover', () =>{
        imageNode.style.display = 'block';
        videoNode.style.display = 'none';
        if (moviesNamesList.length !== 0) {
            let movieName = playedMovie ? playedMovie : moviesNamesList[0];
            imageNode.src = moviesDict[movieName]["imageURL"];
        }
    })
    menuContainer.addEventListener('mouseleave', (event) => {
        imageNode.style.display = 'none';
        videoNode.style.display = 'block';
    });
    menuContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    menuContainer.addEventListener('contextmenu', event => event.preventDefault());
    menuContainer.addEventListener("contextmenu", (event) => {
        event.stopPropagation();
    });

    const playMovieOnClick = function (movieName) {
        menuContainer.style.display = 'none';
        imageNode.style.display = 'none';
        videoNode.style.display = 'block'
          document.body.classList.add("noCursor");
        playMovie(movieName);
    }

    const handleItemClick = (li, type, movieFile) => {
        li.addEventListener(type, () => {
            playMovieOnClick(movieFile);
        })
    }

    const handleItemHover = (li, movieFileName) => {
        li.addEventListener('mouseover', (event) => {
            imageNode.style.display = 'block';
            videoNode.style.display = 'none';
            imageNode.src = moviesDict[movieFileName]["imageURL"];
            event.stopPropagation();
        })
    }

    function addListItem(movieFileName) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const mainSpan = document.createElement('span');
        const secondarySpan = document.createElement('span');

        mainSpan.classList.add('main-text');
        secondarySpan.classList.add('secondary-text');

        mainSpan.textContent = moviesDict[movieFileName]["authorName"];
        secondarySpan.textContent = moviesDict[movieFileName]["movieName"];

        a.appendChild(mainSpan);
        a.appendChild(secondarySpan);
        li.appendChild(a);

        handleItemClick(li, 'click', movieFileName)
        handleItemClick(li, 'contextmenu', movieFileName)
        handleItemHover(li, movieFileName)

        myList.appendChild(li);
    }

    fetchMovies().then(() => {
        for (let i = 0; i < moviesNamesList.length; i++) {
            addListItem(moviesNamesList[i]);
        }
    })
});
