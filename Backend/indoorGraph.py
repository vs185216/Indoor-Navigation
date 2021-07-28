import json
import networkx as nx
import numpy as np
import math
from numpy.linalg import norm


class indoorGraph:
    graph = []
    storeNodes = []
    def readJson(self, graph, nodeType):
        G = []
        nodes = []
        count = 1
        if(nodeType == 'S'):
            for node in graph:
                nodeId = nodeType + str(count)
                nodePos = np.array([int(node['x']), int(node['y'])])
                G.append([nodeId, nodePos])
                nodes.append([nodeId, node['storeName'],nodePos])
                count += 1
            # return (G, nodes)
        else:
            for node in graph:
                    nodeId = nodeType + str(count)
                    nodePos = np.array([int(node['x']), int(node['y'])])
                    G.append([nodeId, nodePos])
                    nodes.append([nodeId, node['cNodeId'],nodePos])
                    count += 1
        print(G)
        return (G, nodes)

        


    def alignNodes(self, G):
        i = 0
        for nodeId_i, pos_i in G:
            i += 1
            for nodeId_j, pos_j in G[i:]:
                for axis in range(2):
                    if(1 <= abs(pos_i[axis] - pos_j[axis]) < 2):
                        pos_i[axis] = pos_j[axis] = (
                            pos_i[axis] + pos_j[axis])/2

        i = 0
        for nodeId_i, pos_i in G:
            i += 1
            for nodeId_j, pos_j in G[i:]:
                for axis in range(2):
                    if(1 <= abs(pos_i[axis] - pos_j[axis]) < 2):
                        pos_i[axis] = pos_j[axis] = int(
                            (pos_i[axis] + pos_j[axis])//2)
        return G

    def mapStorenode(self, nodes, G):
        for i in range(len(nodes)):
            if(nodes[i][0] == G[i][0]):
                nodes[i][2] = (G[i][1]*20)+10
            # print(nodes[i])
        return nodes

    def getCorridors(self, G):
        G = sorted(G, key=lambda x: x[1][0])
        Corners = []
        i = 0
        for nodeId_i, pos_i in G:
            i += 1
            for nodeId_j, pos_j in G[i:]:
                if(not(pos_i[0] == pos_j[0] or pos_i[1] == pos_j[1])):
                    if(not([pos_i[0], pos_j[1]] in Corners)):
                        Corners.append([pos_i[0], pos_j[1]])
                    else:
                        Corners.pop(Corners.index([pos_i[0], pos_j[1]]))

                    if(not([pos_j[0], pos_i[1]] in Corners)):
                        Corners.append([pos_j[0], pos_i[1]])
                    else:
                        Corners.pop(Corners.index([pos_j[0], pos_i[1]]))
        corridorCorners = []
        count = 1
        for node in Corners:
            cId = "C" + str(count)
            corridorCorners.append([cId, np.array(node)])
            count += 1

        Corridors = []
        for i in range(len(Corners)):
            for j in range(i+1, len(Corners)):
                if(Corners[i][0] == Corners[j][0]):
                    Corridors.append(
                        [0, np.array(Corners[i]), np.array(Corners[j])])
                if(Corners[i][1] == Corners[j][1]):
                    Corridors.append(
                        [1, np.array(Corners[i]), np.array(Corners[j])])
        return corridorCorners, Corridors

    def validateNewNode(self, newNode):
        axis, p3, p1, p2, d = newNode
        if(d == 0):
            return True

        if(axis):
            x1 = int(min(p1[0], p2[0]))
            x2 = int(max(p1[0], p2[0])+1)
            x3 = int(p3[0])
            if(x3 in range(x1, x2)):
                return True

        else:
            y1 = int(min(p1[1], p2[1]))
            y2 = int(max(p1[1], p2[1])+1)
            y3 = int(p3[1])
            if(y3 in range(y1, y2)):
                return True

        return False

    def getCorridorNodes(self, storeNodes, Corridors, CorridorNodes):
        i = 0
        for sId, storeNode in storeNodes:
            i += 1
            distance = []
            for [axis, p1, p2] in Corridors:
                d = norm(np.cross(p2-p1, p1-storeNode))/norm(p2-p1)
                if(d == 0):
                    if(norm(p1-storeNode) > norm(p2-storeNode)):
                        distance.append(
                            [axis, p2.copy(), p1.copy(), p2.copy(), d])
                    else:
                        distance.append(
                            [axis, p1.copy(), p1.copy(), p2.copy(), d])
                else:
                    newNode = storeNode.copy()
                    newNode[axis] = p1[axis]
                    distance.append(
                        [axis, newNode.copy(), p1.copy(), p2.copy(), d])

            distance = sorted(distance, key=lambda d: d[-1])
            newNode = []
            flag = 0
            for newNodes in distance:
                if(self.validateNewNode(newNodes)):
                    newNode = newNodes[1].copy()
                    flag = 1
                    break
            if(flag):
                for cId, cnode in CorridorNodes:
                    if(np.array_equal(newNode, cnode)):
                        flag = 0
                        break
                if(flag):
                    cId = "C" + str(len(CorridorNodes) + 1)
                    CorridorNodes.append([cId, newNode])
        return CorridorNodes

    def intermediateCNode(self, corridors, corridorNodes):
        for axis, p1, p2 in corridors:
            newNode = p1.copy()
            if(axis):
                x1 = int(min(p1[0], p2[0]))
                x2 = int(max(p1[0], p2[0]))
                for x3 in range(x1+1, x2):
                    newNode[0] = x3
                    cId = "C" + str(len(corridorNodes)+1)
                    corridorNodes.append([cId, newNode.copy()])
            else:
                y1 = int(min(p1[1], p2[1]))
                y2 = int(max(p1[1], p2[1]))
                for y3 in range(y1+1, y2):
                    newNode[1] = y3
                    cId = "C" + str(len(corridorNodes)+1)
                    corridorNodes.append([cId, newNode.copy()])
        return corridorNodes

    def connectSNodes(self, corridorNodes, storeNodes):
        edges = []
        for sId, p1 in storeNodes:
            distance = [9999]
            for cId, p2 in corridorNodes:
                if((p1 == p2).any()):
                    d = int(norm(p2-p1))
                    if(distance[-1] > d):
                        distance = [sId, cId, p1, p2, d]
                    # print(distance)
            if(len(distance) == 1):
                for cId, p2 in corridorNodes:
                    d = int(norm(p2-p1))
                    if(distance[-1] > d):
                        distance = [sId, cId, p1, p2, d]
            # if(len(distance)>1):
            edges.append(distance)
        return edges

    def connectCNodes(self, corridorNodes):
        edges = []
        i = 0
        for cId_i, p1 in corridorNodes:
            # i += 1
            distance = []
            for cId_j, p2 in corridorNodes[i:]:
                if((p1 == p2).any()):
                    d = int(norm(p2-p1))
                    distance.append([cId_i, cId_j, p1, p2, d])
            distance = sorted(distance, key=lambda x: x[-1])
            try:
                edges.append(distance[1])
                edges.append(distance[2])
            except:
                # edges.append(distance[0])
                pass
        return edges

    def createGraph(self, nodes, edges):
        G = nx.Graph()
        for [id, pos] in nodes:
            G.add_node(id,
                       storeName=id,
                       position=((pos[0]*20)+10, (pos[1]*20)+10))

        for [id1, id2, p1, p2, d] in edges:
            G.add_edge(id1, id2, weight=d)
        return G

    def showGraph(self, G):
        pos = {}
        for node in G.nodes(data=True):
            # print(node)
            pos[node[0]] = [int(p) for p in node[1]['position'][0:2]]
        nx.draw_networkx(G, pos=pos)

    def computeShortestPath(self, G, nodes):
        path = nx.bidirectional_dijkstra(
            G, nodes[0], nodes[1], weight="weight")
        return path

    def getGraph(self):
        return self.graph
         
    def __init__(self, stores, corridors):
        sGraph, sNodes = self.readJson(stores, "S")
        cGraph, cNodes = self.readJson(corridors, "C")
        storeNodes = self.alignNodes(sGraph)
        corridorNodes = self.alignNodes(cGraph)
        corridorCorners, corridors = self.getCorridors(corridorNodes)
        corridorNodes = corridorCorners.copy()
        corridorNodes = self.intermediateCNode(corridors, corridorNodes)
        corridorNodes = self.getCorridorNodes(
            storeNodes, corridors, corridorNodes)
        sEdges = self.connectSNodes(corridorNodes, storeNodes)
        cEdges = self.connectCNodes(corridorNodes)
        allNodes = storeNodes.copy()
        allNodes += corridorNodes
        allEdges = sEdges.copy()
        allEdges += cEdges
        self.storeNodes = self.mapStorenode(sNodes,storeNodes)
        # print(self.storeNodes)
        self.graph = self.createGraph(allNodes, allEdges)

# inG = indoorGraph(stores ="./Jsons/S1.json",corridors="./Jsons/C1.json")
# print(inG.storeNodes)