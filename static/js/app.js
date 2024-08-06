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

document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const myList = document.getElementById('lista');
  const listItems = myList.querySelectorAll('li');

  toggleButton.addEventListener('click', () => { // function to show/hide menu
      if (myList.style.display === 'none' || myList.style.display === '') {
          myList.style.display = 'block';
          toggleButton.textContent = 'Hide List';
      } else {
          myList.style.display = 'none';
          toggleButton.textContent = 'Show List';
      }
//        myList.classList.toggle('show');
  });
  myList.addEventListener('mouseover', (event) => {
            if (event.target.tagName === 'LI' || event.target.closest('li')) {
                const li = event.target.tagName === 'LI' ? event.target : event.target.closest('li');
                const mainText = li.querySelector('.main-text').textContent;
                document.body.style.backgroundColor = mainText;
                    }
        });

  listItems.forEach(item => {
    item.addEventListener('click', (event) => {
        const clickedItem = event.target; // Get the clicked list item
        console.log(`You clicked on ${clickedItem.textContent}`);
        // Call your function here
        handleListItemClick(clickedItem.textContent);
    });
  });

  function handleListItemClick(itemText) {
    myList.style.display = 'none';
    toggleButton.textContent = 'Show List';
    var l=document.getElementById("1")
    l.innerHTML=itemText
  }

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
          myList.appendChild(li);
      }




});



