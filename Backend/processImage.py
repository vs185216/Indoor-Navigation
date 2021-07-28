import cv2 as cv
from networkx.algorithms import boundary
import numpy as np
import matplotlib.path as mplpath

class processImage:
    storeBoundries = []
    grayScale = None
    storeImage = None
    def getGrayScale(self, image):
        return cv.cvtColor(image, cv.COLOR_BGR2GRAY)

    # def getCannyEdge(self, image):
    def getCannyEdge(self):
        gray = self.grayScale
        # gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
        filter = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        filtered=cv.filter2D(gray,-1,filter)

        thresh = cv.threshold(filtered, 128, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)[1]

        Canny = np.zeros(thresh.shape, dtype=np.uint8)
        contours, hierarchy  = cv.findContours(thresh, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
        i = 0
        for c in contours:
            perimeter = cv.arcLength(c, True)
            storeArea = cv.approxPolyDP(c, 0.02 * perimeter, True)
            if(4 <= len(storeArea) <=6):
                [Next, Previous, First_Child, Parent] = hierarchy[0][i]
                if(First_Child != -1 and Parent != -1):
                    cv.drawContours(Canny, [c], -1, (255,255,255), 2)
            i += 1
        return cv.bitwise_not(Canny)

    def getStoreBoundries(self):
        img  = self.getCannyEdge()
        boundries = []
        res_img = np.zeros((img.shape[0], img.shape[1]), dtype=np.uint8)
        contours, hierarchy  = cv.findContours(img, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)
        for c in contours:
            if(4 <= len(c) <= 8):
                perimeter = cv.arcLength(c, True)
                storeArea = cv.approxPolyDP(c, 0.02 * perimeter, True)
                if(4 <= len(storeArea) <= 6 ):
                    boundary = []
                    cv.drawContours(res_img, [c], -1, (255,255,255), 2)
                    for i in range(len(storeArea)):
                        boundary.append(storeArea[i][0])
                    boundries.append(boundary)
        if( boundries[0][2][0]==img.shape[1] - 1 or boundries[0][2][0]==img.shape[1] - 1 ):
            boundries.pop(0)
            # pass
        # self.mapStores(storeNodes,boundries)
        return cv.bitwise_not(res_img), boundries
    
    def mapStores(self, storeNodes):
        fontScale = 0.5
        font = cv.FONT_HERSHEY_SIMPLEX
        color = (0, 0, 0)
        thickness = 1
        sImage, boundries = self.getStoreBoundries()
        for id, name, pos in storeNodes:
            for boundry in  boundries:
                if(self.findstore(boundry,pos)):
                    self.storeBoundries.append([id, name, np.array2string(np.array(boundry))])
                    avg_x = avg_y = 0
                    for i in boundry:
                        avg_x += int(i[0])
                        avg_y += int(i[1])
                    avg_x = avg_x//len(boundry)
                    avg_y = avg_y//len(boundry)
                    sImage = cv.putText(sImage, name, (avg_x,avg_y), font, 
                   fontScale, color, thickness, cv.LINE_AA)
        self.storeImage = sImage.copy()

    def findstore(self, vertices,point):
        polygon = mplpath.Path(np.array(vertices))
        return polygon.contains_point(point)

# font = cv2.FONT_HERSHEY_SIMPLEX
  

    
    def __init__(self,image):
    # def __init__(self,image,storeNodes):
        self.grayScale = self.getGrayScale(image)
        # Canny = self.getCannyEdge(image)
        # self.storeImage, sboundries = self.getStoreBoundries(Canny)
        # self.mapStores(storeNodes,sboundries)

# D = processImage(cv.imread("./Blueprints/i1.png"),"124")