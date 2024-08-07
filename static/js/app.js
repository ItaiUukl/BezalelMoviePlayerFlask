let moviesDict = {};
let playedMovie = '';


const fetchMovies = async () => {
    const res = await fetch('/movies')
    moviesDict = await res.json()
    for (let name in moviesDict) {
        moviesDict[name]["file"] = await fetch('/movie/' + name);
    }
};

const playMovie = function (name) {
    const videoNode = document.querySelector('video')

    if (name !== playedMovie) {
        videoNode.src = moviesDict[name]["url"];
        playedMovie = name;
    }
    videoNode.pause();
    videoNode.currentTime = 0;
    videoNode.play().then(() => videoNode.style.display = 'block');
};

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('DOMContentLoaded', () => {
    const myList = document.getElementById('lista');
    const listItems = myList.querySelectorAll('li');

    const videoNode = document.querySelector('video')


    videoNode.style.display = 'none';
    videoNode.addEventListener("click", event => event.preventDefault())

    const showMenu = function () { // function to show/hide menu
        if (myList.style.display === 'none' || myList.style.display === '') {
            myList.style.display = 'block';
            videoNode.pause()
        } else {
            myList.style.display = 'none';
            videoNode.play().then();
        }
    }
    document.body.addEventListener('click', showMenu);
    document.body.addEventListener('contextmenu', showMenu);

    myList.addEventListener('mouseover', (event) => {
        if (event.target.tagName === 'LI' || event.target.closest('li')) {
            const li = event.target.tagName === 'LI' ? event.target : event.target.closest('li');
            const mainText = li.querySelector('.main-text').textContent;
            document.body.style.backgroundColor = mainText;
        }
    });
    myList.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    myList.addEventListener('contextmenu', event => event.preventDefault());
    myList.addEventListener("contextmenu", (event) => {
        event.stopPropagation();
    });

    const playMovieOnClick = function (event) {
        myList.style.display = 'none';

        const itemText = event.target.textContent;
        playMovie(itemText);
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

        li.addEventListener('click', playMovieOnClick)
        li.addEventListener("contextmenu", playMovieOnClick)

        myList.appendChild(li);
    }

    fetchMovies().then(() => {
        for (let name in moviesDict) {
            addListItem(name, moviesDict[name]["creators"])
        }
    })

});
