import json
import networkx as nx
from networkx.algorithms.shortest_paths.weighted import goldberg_radzik
import numpy as np
from PIL import Image as P_Image
import io
from numpy.linalg import norm
import matplotlib.path as mplpath
import cv2 as cv
from indoorGraph import indoorGraph
from processImage import processImage
from flask import Flask, render_template, url_for, request, redirect, Response
G = ""  # Global Graph
I  = ""
app = Flask(__name__)

def Get_Post_data(Get_data):
    Json_data = Get_data.decode('utf8').replace("'", '"')
    return json.loads(Json_data)

def Bytes_to_numpy(Image):
    Image = Image.read()
    return np.array(P_Image.open(io.BytesIO(Image)))

@app.route('/', methods=["GET", "POST"])
def home():
    resp = Response('Welcome to Indoor Graph')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/getGrayScaleImage', methods=["GET", "POST"])
def getGrayScaleImage():
    if (request.method == "POST"):
        image = request.files['Imagename']
        if(image):
            image = Bytes_to_numpy(image)
        # image = request.json['image']
        grayScaleImage = processImage.getGrayScale(image)
    resp = Response('Welcome to Image Process')
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp
        
@app.route('/createGraph', methods=["GET", "POST"])
def create_Graph():
    global G
    global I
    if (request.method == "POST"):
        storeNodes = request.json['storeNodes']
        corridorNodes = request.json['corridorNodes']
        image = request.files['Image']
        if(image):
            image = Bytes_to_numpy(image)

    G = indoorGraph(stores ="./Jsons/S1.json",corridors="./Jsons/C1.json")
    I = processImage(image = image,storeNodes = G.storeNodes)
    resp = Response("Graph created")
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

# @app.route('/createGraph', methods=["GET", "POST"])
# def create_Graph():
#     global graph
#     if (request.method == "POST"):
#         path = request.json['path']
#     if (request.method == "GET"):
#         path = request.json['path']
#     graph = indoorGraph.createGraph(path)
#     resp = Response("Graph created")
#     resp.headers['Access-Control-Allow-Origin'] = '*'
    # return resp

if ( __name__ == "__main__" ):
    app.run(debug=True)