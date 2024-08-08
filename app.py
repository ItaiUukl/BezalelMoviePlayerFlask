import struct

import numpy as np
from flask import Flask
from flask import render_template, send_from_directory, jsonify

from os import path, listdir
import sys
import pandas
import json

application_path = ''

# determine if application is a script file or frozen exe
if getattr(sys, 'frozen', False):
    application_path = path.join(path.dirname(sys.executable), '_internal')
elif __file__:
    application_path = path.dirname(__file__)

app = Flask(__name__, static_url_path='/static')

DATA_PATH = path.join(application_path, 'static', 'data')
MOVIES_DIR = path.join('static', 'data', 'movies')
IMAGES_DIR = path.join('static', 'data', 'images')
CSV_DIR = path.join(DATA_PATH, 'csv')


def get_vod_setup():
    excel_files = listdir(CSV_DIR)
    csv_files = [f for f in excel_files if f.endswith(".csv")]
    xls_files = [f for f in excel_files if f.endswith((".xls", ".xlsx", ".xlsm", ".xlt"))]
    if csv_files:
        setup_csv = pandas.read_csv(path.join(CSV_DIR, csv_files[0]))
    elif xls_files:
        setup_csv = pandas.read_excel(path.join(CSV_DIR, xls_files[0]))
    else:
        raise Exception("No csv or xls files found")

    with open(path.join(DATA_PATH, 'csv_setup.json')) as f:
        name_converter = json.load(f)

    setup_dct = {}
    for i in range(len(setup_csv)):
        movie_file_name = setup_csv.iloc[i][name_converter["movieFile"]]
        if (not movie_file_name or type(movie_file_name) is not str or
                not path.isfile(path.join(MOVIES_DIR, movie_file_name))):
            continue

        movie_file_name = str.strip(movie_file_name)

        if movie_file_name not in setup_dct:
            setup_dct[movie_file_name] = {}

        for key, val in name_converter.items():
            if key == "movieOrder":
                setup_dct[movie_file_name][key] = int(setup_csv.iloc[i][val])
            else:
                setup_dct[movie_file_name][key] = str.strip(setup_csv.iloc[i][val])

        setup_dct[movie_file_name]["movieURL"] = path.join(MOVIES_DIR, movie_file_name)
        setup_dct[movie_file_name]["imageURL"] = path.join(IMAGES_DIR, setup_dct[movie_file_name]["imageFile"])

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
