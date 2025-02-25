import mysql.connector

def get_db_handle():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="kerekecske",
            database="recowrite"
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL Database: {e}")
        raise
