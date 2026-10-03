from pymongo import MongoClient

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")

# Select database
db = client["lab_triage"]

# Select collection
reports_collection = db["reports"]