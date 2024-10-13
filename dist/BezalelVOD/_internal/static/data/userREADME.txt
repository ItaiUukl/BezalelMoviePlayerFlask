README.md

for running the program you need three elements: the movies, the movies' thumbnails, and a csv file containing important information.
REMOVE MOCK FILES before adding your own.
all the movies you can put inside the movies folder. you can find it here:
    BezalelVOD/_internal/static/data/movies
all the tunmnails you can put in the images folder. you can find it here:
    BezalelVOD/_internal/static/data/images
the csv can be put in the csv folder that is here ONLY ONE FILE SHOULD EXIST (your csv):
    BezalelVOD/_internal/static/data/csv

your csv must contain in every row:
    1. name of the file of the movie
    2. name of the file of the tunmbnail
    3. names of the authors
    4. movie name
    5. order of playing
the names of the columns doesnt matter, you just have to update the data/csv_setup.json as follows:
{
  "movieName": "(YOUR COLUMN NAME OF MOVIE NAMES)",
  "authorName": "(YOUR COLUMN NAME OF AUTHORS)",
  "movieFile": "(YOUR COLUMN NAME OF MOVIE FILE NAMES)",
  "imageFile": "(YOUR COLUMN NAME OF THUNMNAIL FILE NAME)",
  "movieOrder": "(YOUR COLUMN NAME OF FILM ORDER)"
}
the left side must remain as it is. the right should be adjusted in respect to your csv.
in the right side of "movieOrder" you can write any column you want, and the movies will appear in acsending order by that column.


in order to change simple aspects of the styling, you can adjust the style.css even after the program is running (you will just need to refresh)
first, open the style.css file in BezalelVOD/_internal/static/css/style.css

for changing for size find this part:
.main-text, .secondary-text {
    display: inline-block; /* Display elements inline-block */
    font-size: 25px;
}
and just play with the font-size attribute (you can adjust the number)

you can find exactly how to change every attribute online, but make sure you have a copy of the original style.css in case of emergency.