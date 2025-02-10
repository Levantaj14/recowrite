import mysql.connector

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="kerekecske",
    database="recowrite"
)


def get_db_handle():
    return mydb
