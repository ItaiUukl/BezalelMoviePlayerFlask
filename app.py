import os

from flask import Flask
from flask import render_template, send_from_directory, jsonify

app = Flask(__name__)

MOVIES_DIR = 'static/data/movies'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/movie/<filename>')
def get_movie(filename):
    return send_from_directory(MOVIES_DIR, filename)


@app.route('/movies')
def list_movies():
    movies = os.listdir(MOVIES_DIR)
    return jsonify({m: {"url": MOVIES_DIR + '/' + m} for m in movies})


if __name__ == '__main__':
    app.run()
