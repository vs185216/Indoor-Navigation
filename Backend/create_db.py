import mysql.connector

mydb = mysql.connector.connect(
	host="localhost",
	user="root",
	# passwd = "",
	)

my_cursor = mydb.cursor()

# my_cursor.execute("create database customerdb")


my_cursor.execute("use customerdb")

my_cursor.execute("drop table imagePath")
my_cursor.execute("drop table productDetails")
my_cursor.execute("drop table inStoreDetails")
my_cursor.execute("drop table Edges")
my_cursor.execute("drop table Nodes")


my_cursor.execute("create table imagePath (floorno int, url varchar(255))")
my_cursor.execute("create table productDetails (productid int not null auto_increment, storename varchar(255), productname varchar(255), primary key (productid))")
my_cursor.execute("create table inStoreDetails (storeid varchar(255), storename varchar(255), floorno int, boundrypoint varchar(255),primary key (storeid))")
my_cursor.execute("create table Edges (nodeid1 varchar(100), nodeid2 varchar(100), weight int)")
my_cursor.execute("create table Nodes (nodeid varchar(100) unique, nodename varchar(255), x int, y int, z int, primary key (nodeid))")



my_cursor.execute("show tables")
for table in my_cursor:
	print(table)


# my_cursor.execute("select * from graphnode")
# for row in my_cursor:
# 	print(row)

