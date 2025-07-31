let moviesDict = {};
let moviesNamesList = [];
let playedMovie = '';
let currentMovieIndex = 0;
let isMoving = false;
let moveTimeout;
let lockMovement;
let isMenuShowing = true;
let hoveredMovie;
// const langs = {
//   heb: 'Heb',
//   eng: 'Eng',
//   arb: 'Arb',
// };
// const playingTitle = {
//   Heb: ':מתנגן כעת',
//   Eng: 'Playing:',
//   Arb: ':مهارة الكتابة',
// };
// let currentLanguage = langs.heb;
const DELAY_TIME_SECONDS = 20;
const CALCULATED_TIME = DELAY_TIME_SECONDS * 1000;
const IMAGE_FILE_DICT_CONST = 'imageFile';
const MOVIE_NAME_DICT_CONST = 'movieName';
const MOVIE_URL_DICT_CONST = 'movieURL';
const MOVIE_FILE_NAME_DICT_CONST = 'movieFile';
const IMAGE_URL_DICT_CONST = 'imageURL';
const MOVIE_ORDER_DICT_CONST = 'movieOrder';
const AUTHORS_DICT_CONST = 'authorName';
const SCROLL_AMOUNT = 500;
const TRIGGERS_DICT_CONST = 'triggers';
const DESCRIPTION_DICT_CONST = 'description';
const LENGTH_DICT_CONST = 'length';
const NOW_PLAYING = 'עכשיו מתנגן';
const ROOM_DICT_CONST = 'room';
const VOL_STEP = 0.05;

/**
 * Fetches all movies urls from the (local) server and updates the inner data accordingly.
 */
const fetchMovies = async () => {
  const res = await fetch('/movies');
  moviesDict = await res.json();
  moviesNamesList = Object.keys(moviesDict).sort((a, b) =>
    moviesDict[a]['movieOrder'].localeCompare(moviesDict[b]['movieOrder'])
  );
};

// const chooseLanguage = (key) => {
//   return key + currentLanguage;
// };

// Ignoring default mouse functionality (right click - contextmenu & middle click - mousedown.button 1.
document.addEventListener('contextmenu', (event) => event.preventDefault());
document.addEventListener('mousedown', (event) => {
  if (event.button === 1) {
    event.preventDefault();
  }
});

/**
 * Enters full screen, covering all browsers options (hopefully).
 */
const enterFullScreen = () => {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    // Firefox
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    // IE/Edge
    document.documentElement.msRequestFullscreen();
  }
};

// The main setup of the app, starts on the initial DOM load.
document.addEventListener('DOMContentLoaded', () => {
  // The list of movie links in the sidebar menu
  const moviesList = document.getElementById('moviesList');
  // The container of the sidebar menu
  const menuContainer = document.getElementById('menuContainer');

  const pauseContainer = document.getElementById('pauseContainer');

  // The node that runs all the videos (only source changes).
  const videoNode = document.getElementById('moviePlayer');
  // The node that shows all the movies thumbnails (only source changes).
  const imageDetails = document.getElementById('bodyImgPic');
  const movieNameHeadline = document.getElementById('movieName');
  const authorsHeadline = document.getElementById('authors');
  const movieLengthHeadline = document.getElementById('movLength');
  const movieDescriptionHeadline = document.getElementById('movDesc');
  const nowPlayingHeadline = document.getElementById('nowPlaying');
  const triggerssHeadline = document.getElementById('triggers');
  const roomHeadline = document.getElementById('roomNumHeadline');
  const menuBackground = document.querySelector('.image-container');
  //   const playButton = document.getElementById('playButton');
  const replayButton = document.getElementById('replayButton');

  /**
   * Plays the given movie from the beginning.
   * @param fileName The name of the movie file (this is how the movies are serialized).
   */
  const playMovie = (fileName) => {
    const videoNode = document.getElementById('moviePlayer');
    enterFullScreen(); // In case this the first play.
    if (fileName !== playedMovie) {
      videoNode.src = moviesDict[fileName]['movieURL'];
      playedMovie = fileName;
    }
    videoNode.pause();
    videoNode.currentTime = 0;
    videoNode.play().then(() => (videoNode.style.display = 'flex'));
    videoNode.addEventListener('ended', playNextMovie);
  };

  /**
   * Plays the next movie.
   */
  const playNextMovie = () => {
    currentMovieIndex = (currentMovieIndex + 1) % moviesNamesList.length;
    hoveredMovie = moviesNamesList[currentMovieIndex];
    playMovie(moviesNamesList[currentMovieIndex]);
  };

  /**
   * Manages containers for playing a movie and plays it.
   * @param movieFile The name of the movie file (movie identifier).
   */
  const playMovieOnClick = (movieFile) => {
    clickHandler();
    currentMovieIndex = moviesDict[movieFile][MOVIE_ORDER_DICT_CONST] - 1;
    playMovie(movieFile);
  };

  replayButton.addEventListener('click', function () {
    // playMovieOnClick(hoveredMovie);
    currentMovieIndex = moviesDict[hoveredMovie][MOVIE_ORDER_DICT_CONST] - 1;
    playMovie(hoveredMovie);
  });

  playButton.addEventListener('click', function () {
    clickHandler();
    if (moviesNamesList[currentMovieIndex] === hoveredMovie) {
      showMenu();
    } else {
      currentMovieIndex = moviesDict[hoveredMovie][MOVIE_ORDER_DICT_CONST] - 1;
      showMenu();
      playMovie(hoveredMovie);
    }
  });

  videoNode.addEventListener('click', (event) => event.preventDefault());

  // document.addEventListener('mousemove', () => {
  //   if (!isMoving) {
  //     isMoving = true;
  //     if (!isMenuShowing) {
  //       showMenu();
  //     }
  //   }

  //   clearTimeout(moveTimeout);
  //   moveTimeout = setTimeout(() => {
  //     isMoving = false;
  //     if (isMenuShowing) {
  //       showMenu();
  //     }
  //   }, CALCULATED_TIME);
  // });

  /**
   * Changes sidebar menu display (flex(on) <-> none(off))
   */
  const showMenu = () => {
    if (!isMenuShowing) {
      pauseContainer.style.display = 'flex';
      videoNode.pause();
      hoveredMovie = moviesNamesList[currentMovieIndex];
      changeDetails(hoveredMovie);
      // Reveal cursor with menu
      document.body.classList.remove('noCursor');
      isMenuShowing = true;
      menuBackground.classList.remove('hidden');
    } else {
      pauseContainer.style.display = 'none';
      //   imageNode.style.display = 'none';
      videoNode.style.display = 'block';
      menuBackground.classList.add('hidden');

      // Hide cursor while menu is hidden
      document.body.classList.add('noCursor');
      videoNode.play().then();
      isMenuShowing = false;
    }
  };
  const clickHandler = () => {
    showMenu();
    clearTimeout(moveTimeout);
    clearTimeout(lockMovement);
    lockMovement = setTimeout(() => {
      isMoving = false;
      if (isMenuShowing) {
        moveTimeout = setTimeout(() => {
          showMenu();
        }, CALCULATED_TIME - 1000);
      }
    }, 1000);
  };
  // Bind mouse clicks to menu change.
  document.body.addEventListener('click', clickHandler);
  document.body.addEventListener('contextmenu', showMenu);

  //   // Sets the current movie thumbnail while cursor is on sidebar menu.
  //   menuContainer.addEventListener('mouseover', () => {
  //     // imageNode.style.display = 'block'; // Shows thumbnail
  //     // videoNode.style.display = 'none';
  //     // if (moviesNamesList.length !== 0) {
  //     //   let movieName = playedMovie ? playedMovie : moviesNamesList[0];
  //     //   imageNode.src = moviesDict[movieName]['imageURL'];
  //     // }
  //   });
  //   // Returns to video (paused frame) when cursor leaves sidebar menu.
  //   menuContainer.addEventListener('mouseleave', (event) => {
  //     // imageNode.style.display = 'none';
  //     videoNode.style.display = 'block';
  //   });

  // Ignore click and right click (contextmenu) functions in outer containers
  // (mostly to avoid video receiving the clicks).
  menuContainer.addEventListener('click', (event) => {
    event.stopPropagation();
  });
  menuContainer.addEventListener('contextmenu', (event) =>
    event.preventDefault()
  );
  menuContainer.addEventListener('contextmenu', (event) => {
    event.stopPropagation();
  });

  /**
   * Binds an event on a movie name list item to play the movie.
   * @param liTag The list item tag to bind.
   * @param eventType The type of event to bind to (mostly clicks).
   * @param movieFile The movie file name to play.
   */
  const handleItemClick = (liTag, eventType, movieFile) => {
    liTag.addEventListener(eventType, () => {
      currentMovieIndex = moviesDict[movieFile][MOVIE_ORDER_DICT_CONST] - 1;
      hoveredMovie = movieFile;
      playMovieOnClick(movieFile);
    });
  };

  const changeDetails = (movieFileName) => {
    hoveredMovie = movieFileName;
    roomHeadline.textContent = moviesDict[movieFileName][ROOM_DICT_CONST];
    imageDetails.src = moviesDict[movieFileName][IMAGE_URL_DICT_CONST];
    movieNameHeadline.textContent =
      moviesDict[movieFileName][MOVIE_NAME_DICT_CONST];
    authorsHeadline.textContent = moviesDict[movieFileName][AUTHORS_DICT_CONST];
    if (hoveredMovie !== moviesNamesList[currentMovieIndex]) {
      //hide now playing
      nowPlayingHeadline.style.opacity = 0;
      replayButton.disabled = true;
      replayButton.classList.add('hidden-button');
    } else {
      nowPlayingHeadline.style.opacity = 1;
      //show now playing
      replayButton.disabled = false;
      replayButton.classList.remove('hidden-button');
    }
    triggerssHeadline.textContent =
      moviesDict[movieFileName][TRIGGERS_DICT_CONST];
    movieLengthHeadline.textContent =
      moviesDict[movieFileName][LENGTH_DICT_CONST];
    movieDescriptionHeadline.textContent =
      moviesDict[movieFileName][DESCRIPTION_DICT_CONST];
  };

  /**
   * Binds movie name list item to change thumbnail image while on it.
   * @param li The movie name container in the list.
   * @param movieFileName The file name of the movie (movie identifier).
   */
  const handleItemHover = (li, movieFileName) => {
    li.addEventListener('mouseover', (event) => {
      //   imageNode.style.display = 'block';
      //   videoNode.style.display = 'none';
      changeDetails(movieFileName);
      //   imageNode.src = moviesDict[movieFileName]['imageURL'];
      event.stopPropagation(); // To avoid sidebar container from picking the mouseover function (default thumbnail).
    });
  };

  /**
   * Creates and fills a single list item for the movies sidebar menu (in html context).
   * @param movieFileName The file name for the movie.
   */
  const addListItem = (movieFileName) => {
    const liTag = document.createElement('li');
    const imgTag = document.createElement('img');
    imgTag.src = moviesDict[movieFileName][IMAGE_URL_DICT_CONST];
    imgTag.alt = moviesDict[movieFileName][MOVIE_NAME_DICT_CONST];
    // imgTag.onclick = () =>
    //   playMovie(moviesDict[movieFileName][MOVIE_URL_DICT_CONST]);

    liTag.appendChild(imgTag);
    // menu.appendChild(li);
    // const aTag = document.createElement('a');
    // const mainSpan = document.createElement('span');
    // const secondarySpan = document.createElement('span');

    // mainSpan.classList.add('main-text');
    // secondarySpan.classList.add('secondary-text');

    // mainSpan.textContent = moviesDict[movieFileName]['authorName'];
    // secondarySpan.textContent = moviesDict[movieFileName]['movieName'];

    // aTag.appendChild(mainSpan);
    // aTag.appendChild(secondarySpan);
    // liTag.appendChild(imgTag);

    handleItemClick(liTag, 'click', movieFileName);
    handleItemClick(liTag, 'contextmenu', movieFileName);
    handleItemHover(liTag, movieFileName);

    moviesList.appendChild(liTag);
  };

  // Populates the list of movies container with the movies info from the server (local).
  fetchMovies().then(() => {
    for (let i = 0; i < moviesNamesList.length; i++) {
      addListItem(moviesDict[moviesNamesList[i]][MOVIE_FILE_NAME_DICT_CONST]);
    }
  });
  const leftBtn = document.querySelector('.scroll-btn.left');
  const rightBtn = document.querySelector('.scroll-btn.right');

  leftBtn.addEventListener('click', () => {
    moviesList.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    moviesList.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  });

  function enableEdgeScrolling(element, options = {}) {
    const {
      edgeSize = 50, // Distance from edge to trigger scrolling
      scrollSpeed = 5, // Pixels to scroll per frame
      direction = 'horizontal', // 'horizontal' or 'vertical'
    } = options;

    let isScrolling = false;
    let animationFrame;

    function startScrolling(scrollDirection) {
      if (isScrolling) return;
      isScrolling = true;

      function scroll() {
        if (!isScrolling) return;

        if (direction === 'horizontal') {
          element.scrollLeft += scrollDirection * scrollSpeed;
        } else {
          element.scrollTop += scrollDirection * scrollSpeed;
        }

        animationFrame = requestAnimationFrame(scroll);
      }

      scroll();
    }

    function stopScrolling() {
      isScrolling = false;
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    }

    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();

      if (direction === 'horizontal') {
        const mouseX = e.clientX - rect.left;
        const elementWidth = rect.width;

        // Check left edge
        if (mouseX < edgeSize) {
          startScrolling(-1); // Scroll left
        }
        // Check right edge
        else if (mouseX > elementWidth - edgeSize) {
          startScrolling(1); // Scroll right
        }
        // Stop scrolling if not near edges
        else {
          stopScrolling();
        }
      } else {
        const mouseY = e.clientY - rect.top;
        const elementHeight = rect.height;
      }
    });

    element.addEventListener('mouseleave', stopScrolling);
  }

  // Horizontal scrolling (default)
  enableEdgeScrolling(moviesList);

  // Custom options
  enableEdgeScrolling(moviesList, {
    edgeSize: 80, // Larger trigger area
    scrollSpeed: 3, // Slower scrolling
    direction: 'horizontal',
  });

  // For vertical scrolling
  enableEdgeScrolling(moviesList, {
    direction: 'vertical',
  });

  // function disableMouseScroll() {
  //   window.addEventListener('wheel', preventWheel, { passive: false });
  // }

  // function preventWheel(e) {
  //   // Allow scrolling on the video node so it can handle volume
  //   const videoNode = document.getElementById('moviePlayer');
  //   if (videoNode.contains(e.target)) return;

  //   e.preventDefault();
  // }

  // Call this to disable
  // disableMouseScroll();
  // window.addEventListener('wheel', preventWheel, { passive: false });

  // videoNode.addEventListener('wheel', (event) => {
  //   console.log('Scrolling on video'); // Add this
  //   event.preventDefault(); // Prevent page from scrolling

  //   // DeltaY > 0 means scroll down → lower volume, up → raise volume
  // });
  document.addEventListener('wheel', (event) => {
    console.log('Global wheel:', event.target);
    const step = VOL_STEP; // Volume change step
    if (event.deltaY < 0) {
      videoNode.volume = Math.min(videoNode.volume + step, 1);
    } else {
      videoNode.volume = Math.max(videoNode.volume - step, 0);
    }
  });
});
