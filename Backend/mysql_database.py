from flask_mysqldb import MySQL
from numpy import where
import yaml
from flask import Flask


class database:
    mysql = None
    app =  None

    def insertNode(self, nodes):
        with self.app.app_context():
            cur = self.mysql.connection.cursor()
            for nodeid, node in nodes:
                nodename = node['storeName']
                x = (int)(node['position'][0])
                y = (int)(node['position'][1])
                z = (int)(0)
                cur.execute("INSERT INTO nodes(nodeid, nodename, x, y, z) VALUES(%s, %s, %s, %s, %s)",(nodeid, nodename, x, y, z))
            self.mysql.connection.commit()
            cur.close()

    def insertEdge(self, edges):
        with self.app.app_context():
            cur = self.mysql.connection.cursor()
            for nodeid1, nodeid2, weight in edges:
                weight = weight['weight']
                cur.execute("INSERT INTO edges(nodeid1, nodeid2, weight) VALUES(%s, %s, %s)",(nodeid1, nodeid2, weight))
            self.mysql.connection.commit()
            cur.close()

    def insertStoreDetails(self, stores):
        with self.app.app_context():
            cur = self.mysql.connection.cursor()
            for storeId,storeName, boundry in stores:
                cur.execute("INSERT INTO instoredetails(storeid, storename, floorno, boundrypoint ) VALUES(%s, %s, %s, %s)",(storeId, storeName, 0, boundry))
            self.mysql.connection.commit()
            cur.close()


    def selectAll(self, tableName):
        with self.app.app_context():
            cur = self.mysql.connection.cursor()
            cur.execute("select * from " + tableName)
            for row in cur:
                print(row)
            cur.close()
    
    def selectQuery(self, Columns, tableName, Condition = None):
        queryOutput = []
        with self.app.app_context():
            cur = self.mysql.connection.cursor()
            query = 'select ' + ','.join(Columns) + ' from ' + tableName
            if(Condition):
                query += ' where ' + Condition
            # print(query) 

            cur.execute(query)
            for row in cur:
                queryOutput.append(row)
            cur.close()
        return queryOutput


    def __init__(self):
        self.app = Flask(__name__)
        db = yaml.load(open('dbconfig.yaml'), yaml.Loader)
        self.app.config['MYSQL_HOST'] = db['mysql_host']
        self.app.config['MYSQL_USER'] = db['mysql_user']
        if(db['mysql_password']):
            self.app.config['MYSQL_PASSWORD'] = db['mysql_password']
        self.app.config['MYSQL_DB'] = db['mysql_db']
        self.mysql = MySQL(self.app)