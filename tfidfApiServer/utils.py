from pymongo import MongoClient


def get_db_handle():
    client = MongoClient(host='localhost', port=27017)
    db_handle = client['recowrite']
    return db_handle
