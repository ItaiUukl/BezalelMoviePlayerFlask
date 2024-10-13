# BezalelMoviePlayer
 Movie player for Bezalel's finals exhibition. Made with Flask as local server side.


About:

    the program is built mainly with 3 languages: 
        javascript for the main part of the program, simple frontend and backend
        css for styling
        python for the flask server
    
    you cannot access files inside the computer through the web browser with javascript, therefore we created a server using python with flask. all the flask coding is in the /app.py file.

    all the javascript coding is is in the /static/js/app.js file.

    all the css styling is in the /static/css/style.css file.

Running the program:
    in order to allow the program to be independent, we used pyinstaller.
    pyinstaller turns the python code into an exe file that can be executed on different computers without needing to install different python libraries.
    the command to build the whole project is:
        pyinstaller --name BezalelVOD app.py
    then change the .spec file like this:
        find this section and change the datas line to look like this:
        a = Analysis(
                    .
                    .
                    datas=[('static', 'static'), ('templates', 'templates')],
                    .
                    .
                    )
    then run this command (you can run only this command from now on as long as you still have a 
    .spec file):
        pyinstaller BezalelVOD.spec
    
After running the project:
    after running the project and producing exe file, you can find the whole project in /dist, and the /dist/BezalelVOD is the important folder containing the exe and everything that is needed for the program to work.
    you can find /dist/BezalelVOD/BezalelVOD.exe. that is the file to run.
    inside /dist/BezalelVOD/_internal/static you can find three folders:
        css: containing the style.css file. you can change it even after running the pyinstaller (for example if you want to only change the font size)
        js: containing the app.js file, also can be changed after running but be more carefull with it
        data: where all the movies and the movies' thumbnalis and the csv will be (I leave it to you realizing where they are and where to put them).
        when you want to run the program at Bezalel Graduates Event or any other event of your choice, make sure that you put all the needed data in the data folder (the program reads it from there).

have fun!

                