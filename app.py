from flask import Flask
from flask import render_template, send_from_directory, jsonify
import webbrowser
import threading

import os
import sys
import pandas

application_path = ''

# determine if application is a script file or frozen exe
if getattr(sys, 'frozen', False):
    application_path = os.path.join(os.path.dirname(sys.executable), '_internal')
elif __file__:
    application_path = os.path.dirname(__file__)

app = Flask(__name__, static_url_path='/static')

DATA_PATH = os.path.join(application_path, 'static', 'data')
MOVIES_DIR = os.path.join('static', 'data', 'movies')
IMAGES_DIR = os.path.join('static', 'data', 'images')
CSV_DIR = os.path.join(DATA_PATH, 'csv')


def get_vod_setup():
    setup_csv = pandas.read_csv(os.path.join(CSV_DIR, 'BezalelVODSettings.csv'))
    setup_dct = {}
    for i in range(len(setup_csv)):
        movie_name = setup_csv.iloc[i]["movieName"]
        setup_dct[movie_name] = setup_csv.drop("movieName", axis=1).iloc[i].to_dict()
        setup_dct[movie_name]["url"] = os.path.join(MOVIES_DIR, setup_csv.iloc[i]["movieFile"])
        setup_dct[movie_name]["img_url"] = os.path.join(IMAGES_DIR, setup_csv.iloc[i]["imageFile"])

    return setup_dct


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/movie/<filename>')
def get_movie(filename):
    return send_from_directory(MOVIES_DIR, filename)


@app.route('/movies')
def list_movies():
    return jsonify(get_vod_setup())


def run_server():
    app.run(port=5000)


if __name__ == '__main__':
    # Run Flask server in a separate thread
    server_thread = threading.Thread(target=run_server)
    server_thread.start()
    webbrowser.open_new('http://127.0.0.1:5000')
