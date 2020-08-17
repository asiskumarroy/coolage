import argparse
import sys
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json


def setting(args,jsondata):
    cred = credentials.Certificate(args.jsoncred)
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    with open(jsondata) as f:
        data = json.load(f)

    doc_ref = db.collection(u'College').document(args.collegename)
    doc_ref.set(data)

def values():
    parser=argparse.ArgumentParser()
    parser.add_argument('--collegename',type=str,default='NITS',help="College name")
    parser.add_argument('--jsoncred', type=str, help="Provide the name of the json file with the credentials")
    args=parser.parse_args()
    setting(args,'resources.json')
    sys.stdout.write("Successfully added")

if __name__ == '__main__':
    values()
