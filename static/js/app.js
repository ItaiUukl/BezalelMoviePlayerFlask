let moviesDict = {};
let moviesNamesList = [];
let playedMovie = '';
let currMovieIndex = 0;


const fetchMovies = async () => {
    const res = await fetch('/movies')
    moviesDict = await res.json()
    moviesNamesList = Object.keys(moviesDict);
};


const playMovie = function (name) {
    const videoNode = document.getElementById('moviePlayer');
    enterFullScreen();
    if (name !== playedMovie) {
        videoNode.src = moviesDict[name]["url"];
        playedMovie = name;
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

document.documentElement.addEventListener('loadeddata', (event) => {
    if (moviesNamesList.length > 0) {
        playMovie(moviesNamesList[0]);
    }
})

document.documentElement.addEventListener('mousemove', (event) => {
    if (document.fullscreenElement !== document.documentElement || document.webkitFullscreenElement !== document.documentElement){
        enterFullScreen()
    }
})


document.addEventListener('DOMContentLoaded', () => {
    const myList = document.getElementById('lista');
    const listItems = myList.querySelectorAll('li');

    const videoNode = document.getElementById('moviePlayer')
    const imageNode = document.getElementById('movieImage')

    videoNode.addEventListener("click", event => event.preventDefault())

    const showMenu = function () { // function to show/hide menu
        if (myList.style.display === 'none' || myList.style.display === '') {
            myList.style.display = 'block';
            videoNode.pause()
        } else {
            myList.style.display = 'none';
            imageNode.style.display = 'none';
            videoNode.style.display = 'block'
            videoNode.play().then();
        }
    }
    document.body.addEventListener('click', showMenu);
    document.body.addEventListener('contextmenu', showMenu);

    myList.addEventListener('mouseover', (event) => {
        if (event.target.tagName === 'LI' || event.target.closest('li')) {
            const li = event.target.tagName === 'LI' ? event.target : event.target.closest('li');
            imageNode.style.display = 'block';
            videoNode.style.display = 'none';
            imageNode.src = moviesDict[li.querySelector('.main-text').textContent]["img_url"];
        }
    });

    myList.addEventListener('mouseleave', (event) => {
        imageNode.style.display = 'none';
        videoNode.style.display = 'block';
    });
    myList.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    myList.addEventListener('contextmenu', event => event.preventDefault());
    myList.addEventListener("contextmenu", (event) => {
        event.stopPropagation();
    });

    const playMovieOnClick = function (movieName) {
        myList.style.display = 'none';
        imageNode.style.display = 'none';
        videoNode.style.display = 'block'
        playMovie(movieName);
    }
    const handleItemClick = (li, type, mainText) => {
        li.addEventListener(type, () => {
            playMovieOnClick(mainText);
        })
    }

    listItems.forEach(item => {
        item.addEventListener('click', playMovieOnClick)
        item.addEventListener('contextmenu', playMovieOnClick)
    });

    function addListItem(mainText, secondaryText) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const mainSpan = document.createElement('span');
        const secondarySpan = document.createElement('span');

        mainSpan.classList.add('main-text');
        secondarySpan.classList.add('secondary-text');

        mainSpan.textContent = mainText;
        secondarySpan.textContent = secondaryText;

        a.appendChild(mainSpan);
        a.appendChild(secondarySpan);
        li.appendChild(a);

        handleItemClick(li, 'click', mainText)
        handleItemClick(li, 'contextmenu', mainText)

        myList.appendChild(li);
    }

    fetchMovies().then(() => {
        for (let name in moviesDict) {
            addListItem(name, moviesDict[name]["creators"])
        }
    })
});
