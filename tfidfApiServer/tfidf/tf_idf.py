import sklearn.feature_extraction.text as ft
import numpy as np
import faiss
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import os
from joblib import dump, load

nltk.download('stopwords')
nltk.download('punkt_tab')


mongo_id = {
    0: '6742c8022f358cfd5c5d80cf',
    1: '677c89c2dfef7212b57043fc',
    2: '677c8820dfef7212b57043f9'
}


def read_file(filename):
    f = open(filename, 'r')
    document = []
    aux = f.readline()
    while aux != '':
        document.append(aux)
        aux = f.readline()
    f.close()
    return ''.join(document)


def filtering(blog):
    stop_words = set(stopwords.words('english'))
    words = word_tokenize(blog)
    filtered_words = [word.lower() for word in words if
                      word.lower() not in stop_words and word not in string.punctuation]
    return " ".join(filtered_words)


def setup():
    global vectorizer, index
    index_path = 'tfidf/index.bin'
    vectorizer_path = 'tfidf/vectorizer.joblib'
    # initialize vectorizer and creating a fit
    if not os.path.exists(index_path) or not os.path.exists(vectorizer_path):
        corpora = [read_file('tfidf/blog1.txt'), read_file('tfidf/blog2.txt'), read_file('tfidf/blog3.txt')]
        filtered_corpus = []
        for corpus in corpora:
            filtered_corpus.append(filtering(corpus))

        vectorizer = ft.TfidfVectorizer()
        fit = vectorizer.fit_transform(filtered_corpus)

        # saving the vectorizer
        dump(vectorizer, 'tfidf/vectorizer.joblib')

        # print
        print("Feature names:")
        print(vectorizer.get_feature_names_out())

        print("\nOriginal transformed data:")
        print(fit.toarray())

        # converting data for faiss
        dense_matrix = fit.toarray().astype(np.float32)

        # setting up faiss
        dimension = dense_matrix.shape[1]
        # print("Dimension: ", dimension)
        index = faiss.IndexFlatL2(dimension)
        index.add(dense_matrix)

        # saving faiss index
        faiss.write_index(index, "tfidf/index.bin")
    else:
        print("Loading necessary files...")
        vectorizer = load('tfidf/vectorizer.joblib')
        index = faiss.read_index("tfidf/index.bin")


def search(blog_content, k=1):
    query = filtering(blog_content)
    query_vector = vectorizer.transform([query]).toarray().astype(np.float32)
    distances, indices = index.search(query_vector, k)
    print("FAISS search result:")
    print(distances, indices)
    ids = []
    for faiss_index in indices[0]:
        ids.append(mongo_id[faiss_index])
    return ids


def add(blog_content):
    blog = filtering(blog_content)
    transformed_data = vectorizer.transform([blog])
    index.add(transformed_data.toarray().astype(np.float32))
    faiss.write_index(index, "tfidf/index.bin")
    print("New blog added successfully")
