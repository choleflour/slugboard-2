# script for dumping all the club info into firebase (web scraped)
import os
from dotenv import load_dotenv
import json
from flask import Flask, jsonify, request, send_file
from google.cloud import storage
import io
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enables CORS for all routes

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os

# Use the application default credentials.
cred = credentials.ApplicationDefault()

# Initialize firebase app with project ID
project_id = os.environ.get('GOOGLE_CLOUD_PROJECT') 

if not project_id:
    print("ERROR: GOOGLE_CLOUD_PROJECT NOT DEFINED")
    exit(1)

# Initialize the Firebase app with the project ID
firebase_admin.initialize_app(cred, {'projectId': project_id})

db = firestore.client()

# get bucket name from env vars
bucket_name = os.environ.get('BUCKET_NAME')
if not bucket_name:
    print("ERROR: BUCKET NAME NOT DEFINED")
    exit(1)


    
def create_club_to_firebase (collection_name, document_name, json_to_dump):
    doc_ref = db.collection(collection_name).document(document_name)
    res = doc_ref.set(json_to_dump)
    print(res)

# access the file
with open("clubs.json", "r") as f:
    data = json.load(f)
for name, info in data.items():
    print(name)
    create_club_to_firebase('clubs', name, {'insta': info})
'''sample: create_club_to_firebase('clubs', 'Taiwanese Student Association', {'insta': '@ucsc_tsa'})'''