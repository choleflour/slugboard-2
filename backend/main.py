from flask import Flask, jsonify, request, send_file
from google.cloud import storage
import io
from flask_cors import CORS

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app) #enables CORS for all routes




# Use the application default credentials.
cred = credentials.ApplicationDefault()


# Initialize firebase app with project ID
project_id = os.environ.get('GOOGLE_CLOUD_PROJECT') 


# Initialize the Firebase app
firebase_admin.initialize_app(cred, {'projectId': project_id})

db = firestore.client()


# get bucket name from env vars
bucket_name = os.environ.get('BUCKET_NAME')
if not bucket_name:
    print("ERROR: BUCKET NAME NOT DEFINED")
    exit(1)

def upload_bytes_to_gcs (bucket, blob, bytes_to_upload):
    '''
    Helper function for uploading bytes (image file bytes for this project) to Google Cloud Storage
    '''

    # Initialize a client
    client = storage.Client()

    # Get the bucket
    bucket = client.get_bucket(bucket_name)

    # Create a blob (object) in the bucket
    blob = bucket.blob(blob)

    # Upload the bytes to the blob
    res = blob.upload_from_string(bytes_to_upload, content_type="image/png")

    print(f"response is {res}")
    return res

def get_gcs_blob(bucket_name, blob_name):
    """
    Get a Google Cloud Storage blob.

    Args:
    - bucket_name (str): The name of the GCS bucket.
    - blob_name (str): The name of the blob (object) within the bucket.

    Returns:
    - google.cloud.storage.blob.Blob: The GCS blob object or None if not found.
    """
    # Initialize a client
    client = storage.Client()

    # Get the bucket
    bucket = client.get_bucket(bucket_name)

    # Get the blob (object) within the bucket
    blob = bucket.blob(blob_name)

    # Check if the blob exists
    if not blob.exists():
        print(f"Blob '{blob_name}' not found in bucket '{bucket_name}'.")
        return None

    return blob

import logging

def get_image_bytes(bucket_name, blob_name):
    # Attempt to get the blob from Google Cloud Storage
    blob = get_gcs_blob(bucket_name, blob_name)
    
    # Log whether the blob was found or not
    if not blob:
        logging.error(f"Blob not found: {blob_name}")
        return None
    
    # Attempt to download the image bytes
    try:
        img_bytes = blob.download_as_bytes()
        
        # Log the size of the image bytes retrieved
        if img_bytes:
            logging.info(f"Retrieved {len(img_bytes)} bytes for blob: {blob_name}")
        else:
            logging.error(f"No data found for blob: {blob_name}")

        return img_bytes
    except Exception as e:
        logging.error(f"Error downloading blob '{blob_name}': {str(e)}")
        return None  # or raise an error depending on your design


def create_event_to_firebase (collection_name, document_name, json_to_dump):
    doc_ref = db.collection(collection_name).document(document_name)
    res = doc_ref.set(json_to_dump)
    print(res)

def get_all_document_names(collection_name):
    # Reference to the collection
    collection_ref = db.collection(collection_name)

    # Get all documents in the collection
    documents = collection_ref.get()

    # Extract document names
    document_names = [doc.id for doc in documents]

    return document_names

def get_all_documents(collection_name):
    # Reference to the collection
    collection_ref = db.collection(collection_name)

    # Get all documents in the collection
    documents = collection_ref.get()

    # Extract document names
    # document_names = [doc.id for doc in documents]e\
    documents_json = {x.id: x.to_dict() for x in documents}
    return documents_json


def get_firestore_document(collection_name, document_name):
    # Initialize Firestore client
    db = firestore.Client()

    # Construct the reference to the document
    doc_ref = db.collection(collection_name).document(document_name)

    # Get the document snapshot
    doc_snapshot = doc_ref.get()

    # Check if the document exists
    if doc_snapshot.exists:
        # Return the document data
        return doc_snapshot.to_dict()
    else:
        print(f"Document '{document_name}' not found in collection '{collection_name}'.")
        return None

@app.route('/')
def hello_world():
    return jsonify(message='Hello, World!')

@app.route('/UploadEventJson/<uuid>', methods=['POST'])
def upload_event_json_post(uuid):
    try:
        data = request.get_json(force=True)
        
        res_json = {} # make a new json to write to db to get rid of junk from data

        # if tags is not in json, add 1
        if 'tags' not in data:
            res_json['tags'] = []
        else:
            res_json['tags'] = data['tags']

        # add the rest of the columns if they don't exist yet
        columns = ['club_or_affiliation', 'eventname', 'date', 'time', 'flyer', 'social_link', 'location', 'type', 'filename']
        for col in columns:
            if col not in data:
                res_json[col] = None
            else:
                res_json[col] = data[col]

        # assemble flyer link
        # if 'filename' not in data:
        #     flyer = f'gs://{bucket_name}/{uuid}.png'
        # else:
        #     flyer = f'gs://{bucket_name}/{data["filename"]}'
        flyer = f'gs://{bucket_name}/{uuid}.png'
        res_json['flyer'] = flyer

        # TODO upload to firebase (uuid as the document)
        create_event_to_firebase('events', uuid, res_json)

        # return at the very least the uuid (see if that's posisble to get)
        return data, 200
    except Exception as e:
        print(f"Exception in /UploadEventJson: {e}")
        return {"exception": str(e)}, 400
    

@app.route('/FetchImage/<uuid>', methods=['GET'])
def fetch_image_json_get(uuid):
    img_bytes = get_image_bytes(bucket_name, f'{uuid}.png')
    # res = send_file(img_bytes, mimetype='image/png')
    # print(res)
    # return res, 200
    # Return the image bytes as a file response
    return send_file(
        io.BytesIO(img_bytes),
        mimetype='image/png',  # Adjust mimetype as per your image type
        # as_attachment=True,
        # download_name=f'{uuid.split("/")[-1]}.png'  # Use the last part of the blob_name as the download name
    )

@app.route('/UploadImage/<uuid>', methods=['POST'])
def upload_event_image_post(uuid):
    # get image bytes
    bytes_to_send = request.data

    # assemble blob name
    blob_name = f'{uuid}.png'

    # upload file to GCS
    upload_bytes_to_gcs(bucket_name, blob_name, bytes_to_send)

    return {}, 200

@app.route('/AllClubs', methods=['GET'])
def all_clubs_get():
    club_names = get_all_document_names('clubs')
    print(f'club_names are {club_names}')
    return {'clubs': club_names}, 200

@app.route('/AllEvents', methods=['GET'])
def all_events_get():
    events = get_all_documents('events')
    return events, 200

@app.route('/NewAllEvents', methods=['GET'])
def new_all_events_get():
    events = get_all_documents('events')
    events_with_local_image = []
    events_with_gcs_image = []

    # get all clubs
    clubs = get_all_documents('clubs')
    print(f"clubs are {clubs}")

    for x in events:
        # print(f'x is {x}')
        events[x]['uuid'] = x
        # club_stuff = get_firestore_document('clubs', events[x]['club_or_affiliation'])
        # if club_stuff:
        #     events[x]['insta'] = club_stuff['insta']
        # else:
        #     events[x]['insta'] = None

        if events[x]['club_or_affiliation']:
            events[x]['insta'] = clubs[events[x]['club_or_affiliation']]['insta']
        else:
            events[x]['insta'] = None

        if 'gs://' in events[x]['flyer']:
            events_with_gcs_image.append(events[x])
        else:
            events_with_local_image.append(events[x])

    events_sorted_list = events_with_local_image + events_with_gcs_image    
    
    return {'events': events_sorted_list}, 200

@app.route('/AllEventNames', methods=['GET'])
def all_event_names_get():
    event_names = get_all_document_names('events')
    return {'events': event_names}

def get_firestore_document(collection_name, document_name):
    # Initialize Firestore client
    db = firestore.Client()

    # Construct the reference to the document
    doc_ref = db.collection(collection_name).document(document_name)

    # Get the document snapshot
    doc_snapshot = doc_ref.get()

    # Check if the document exists
    if doc_snapshot.exists:
        # Return the document data
        return doc_snapshot.to_dict()
    else:
        print(f"Document '{document_name}' not found in collection '{collection_name}'.")
        return None
    

@app.route('/QueryEvent', methods=['POST'])
def query_event_post():
    data = request.get_json(force=True)
    clubs_ref = firestore.client().collection('events')
    selected = []
    data_dict = {}

    print('before entering for loop')
    for club in data['club_or_affiliation']:
        print(f'club is {club}')
        query = clubs_ref.where('club_or_affiliation', '==', club).get()
        print(f"query is {query}")
        for event in query:
            # print(f"event is of type {type(event.id)}")
            selected.append(event.id)  # check
            # print("\n")
            snapshot_data = event.to_dict()
            # print(f'snapshot_data: {snapshot_data}')
            data_dict[event.id] = snapshot_data
            # print(f'dictionary entry: {temp}')
    
    if not selected:
        return f'query: {type(query)} - none found'
            
    return data_dict, 200 #response 

if __name__ == '__main__':
    app.run(debug=True, port=8080)


# document add event listener ("DOM CONTENT LOADED")
# firebase.app


'''
TODO
1. figure out how to get all the data for events (database design, fetching all info)
2. fetch the image somehow


submit button function:
- generate the UUID of event here
- first API: upload json with UUID
- second API: upload image with UUID (be sure to write back to db)
'''