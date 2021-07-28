import io
import os
import json
from logging import debug
import cv2 as cv
from fastapi.datastructures import UploadFile
import numpy as np
# import networkx as nx
# from numpy.linalg import norm
from PIL import Image as P_Image
# import matplotlib.path as mplpath
# from pydantic.types import Json
from indoorGraph import indoorGraph
from processImage import processImage

import uvicorn
import typing 
from fastapi import FastAPI, Body, Request, File, UploadFile, Form, Depends, BackgroundTasks 
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from mysql_database import database

# from flask_mysqldb import MySQL
# import yaml
# from flask import Flask

G = None  # Global Graph
I = None
DB = None


class storeDetailsReq(BaseModel):
    # storeNodes: dict
    # corridorNodes: dict
    storeNodes: typing.Any
    corridorNodes: typing.Any

class storeDetailsRes(BaseModel):
    reply: str

class findPathReq(BaseModel):
    start: str
    destination: str

class findPathRes(BaseModel):
    path: typing.Any 

class storeListRes(BaseModel):
    storeList: typing.List
    productList: typing.List

class grayScaleRes(BaseModel):
    path: str

def Bytes_to_numpy(Image):
    return np.array(P_Image.open(io.BytesIO(Image)))

def ping():
    return {"ping": "pong"}

app = FastAPI(title="Indooer Nav", docs_url="/")
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_event_handler("startup",ping )

@app.get('/init')
def home():
    global G
    global I
    global DB
    stores = "./FTP/S.json"
    corridors = "./FTP/C.json"
    image = "./FTP/Image.png"
    if(os.path.exists(stores) and os.path.exists(corridors) and os.path.exists(image)):
        G = indoorGraph(stores =json.load(open(stores), parse_int=str),corridors=json.load(open(corridors)))
        I = processImage(image = cv.imread(image))
        I.mapStores(G.storeNodes)
        cv.imwrite("./Static-File-Seving/public/FTP/Boundries.png",I.storeImage)
        DB = database()
        # DB.insertStoreDetails(I.storeBoundries)
        print(I.storeBoundries)
        print("yes")

    resp =   {'Welcome to Indoor Graph'}
    return resp


# @app.post('/getGrayScaleImage', response_model=grayScaleRes, status_code=200)
@app.post('/getGrayScaleImage', status_code=200)
async def getGrayScaleImage(image: UploadFile = File(...)):
    global I
    Image  = Bytes_to_numpy(await image.read())
    I = processImage(Image)
    cv.imwrite("./Static-File-Seving/public/FTP/Image.png",Image)
    cv.imwrite("./Static-File-Seving/public/FTP/GrayScale.png",I.grayScale)
    return  {'path' : "http://localhost:8080/FTP/GrayScale.png"}


@app.get('/getGrayScaleImage', status_code=200)
def getGrayScaleImage():
    return  {'path' : "http://localhost:8080/FTP/GrayScale.png"}
@app.get('/getProcessedImage', status_code=200)
def getGrayScaleImage():
    return  {'path' : "http://localhost:8080/FTP/Boundries.png"}
        
@app.post('/createGraph',response_model=storeDetailsRes, status_code=200)
def create_Graph(data: storeDetailsReq):
    global G
    global I
    global DB
    print(data)
    G = indoorGraph(stores = data.storeNodes,corridors=data.corridorNodes)
    I.mapStores(G.storeNodes)
    DB = database()
    cv.imwrite("./Static-File-Seving/public/FTP/Boundries.png",I.storeImage)
    DB.insertStoreDetails(I.storeBoundries)

    # out_file = open("./Static-File-Seving/public/FTP/S.json", "w") 
    # json.dump(data.storeNodes, out_file, indent = 6) 
    # out_file.close() 
    # out_file = open("./Static-File-Seving/public/FTP/C.json", "w") 
    # json.dump(data.storeNodes, out_file, indent = 6) 
    # out_file.close() 

    # DB.insertStoreDetails(I.storeBoundries)

    resp = {'reply': "Graph created"}
    return resp


@app.post('/findPath',response_model = findPathRes)
def findPath(data: findPathReq):
    global G
    nodes  = G.graph.nodes(data=True)
    path_len, path = G.computeShortestPath(G.graph,[data.start,data.destination])
    print(path)
    pixel_path = []
    for node in path:
        pixel_path.append([int(X) for X in nodes[node]['position']])
        # pixel_path.append([{'x': int(X), 'y': int(Y)} for X,Y in nodes[node]['position']])

    return {'path':pixel_path}

@app.get('/storeList', response_model=storeListRes, status_code=200)
def getStoreList():
    global DB
    queryOutput = DB.selectQuery(['storeid','storename'],'instoredetails')
    storeList = []
    productList = []
    for storeId, storeName in queryOutput:
        obj = {
            'storeId' : storeId,
            'storeName': storeName
        }
        storeList.append(obj)
    for productId, productName in queryOutput:
        obj = {
            'productId' : productId,
            'productName': productName
        }
        productList.append(obj)
    return {'storeList' :storeList, 'productList': productList }   
    # return {'storeList' :['S1','S2','S7'], 'productList': ['p1','p2'] }    


if __name__ == "__main__":
    uvicorn.run("Server1:app", host="127.0.0.1", port=5000,debug = True)





# G = indoorGraph(stores =json.load(open('./Jsons/S3.json')),corridors=json.load(open('./Jsons/C3.json')))
# I = processImage(image = cv.imread("./Blueprints/i3.jpg"))
# I.mapStores(G.storeNodes)

# DB = database()
# print(G.graph.nodes(data = True))
# DB.insertNode(G.graph.nodes(data = True))
# DB.insertEdge(G.graph.edges(data = True))
# DB.insertStoreDetails(I.storeBoundries)

# DB.selectAll('store')
# DB.selectQuery(['storeid','storename'],'instoredetails', 'storeid = "S1"')


