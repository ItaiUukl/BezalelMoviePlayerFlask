import pandas
import os

from flask import Flask
from flask import render_template, send_from_directory, jsonify

app = Flask(__name__)

MOVIES_DIR = 'static/data/movies'
CSV_DIR = 'static/data/csv'


def get_vod_setup():
    setup_csv = pandas.read_csv(os.path.join(CSV_DIR, 'BezalelVODSettings.csv'))
    setup_dct = {}
    for i in range(len(setup_csv)):
        movie_name = setup_csv.iloc[i]["movieName"]
        setup_dct[movie_name] = setup_csv.drop("movieName", axis=1).iloc[i].to_dict()
        setup_dct[movie_name]["url"] = os.path.join(MOVIES_DIR, setup_csv.iloc[i]["movieFile"])

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


if __name__ == '__main__':
    app.run()
