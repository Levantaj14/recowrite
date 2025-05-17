import sklearn.feature_extraction.text as ft
import numpy as np
import faiss
import nltk
from langdetect import detect
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import SnowballStemmer
import string
import os
from joblib import dump, load

from base.models import Blog

nltk.download('stopwords')
nltk.download('punkt_tab')

iso_to_nltk = {
    'sq': 'albanian',
    'ar': 'arabic',
    'az': 'azerbaijani',
    'eu': 'basque',
    'be': 'belarusian',
    'bn': 'bengali',
    'ca': 'catalan',
    'zh': 'chinese',
    'da': 'danish',
    'nl': 'dutch',
    'en': 'english',
    'fi': 'finnish',
    'fr': 'french',
    'de': 'german',
    'el': 'greek',
    'he': 'hebrew',
    'hu': 'hungarian',
    'id': 'indonesian',
    'it': 'italian',
    'kk': 'kazakh',
    'ne': 'nepali',
    'no': 'norwegian',
    'pt': 'portuguese',
    'ro': 'romanian',
    'ru': 'russian',
    'sl': 'slovene',
    'es': 'spanish',
    'sv': 'swedish',
    'tg': 'tajik',
    'ta': 'tamil',
    'tr': 'turkish'
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
    language = iso_to_nltk[detect(blog)]
    try:
        stop_words = set(stopwords.words(language))
    except KeyError:
        stop_words = []
    words = word_tokenize(blog)
    filtered_words = [word.lower() for word in words if
                      word.lower() not in stop_words and word not in string.punctuation]
    try:
        stemmer = SnowballStemmer(language)
        stemmed_words = [stemmer.stem(word) for word in filtered_words]
        return " ".join(stemmed_words)
    except ValueError:
        return " ".join(filtered_words)


def setup():
    global vectorizer, index
    index_path = 'tfidf/index.bin'
    vectorizer_path = 'tfidf/vectorizer.joblib'
    # initialize vectorizer and creating a fit
    if not os.path.exists(index_path) or not os.path.exists(vectorizer_path):
        corpora = Blog.objects.all()
        filtered_corpus = []
        my_sql_ids = []
        for corpus in corpora:
            filtered_corpus.append(filtering(corpus.content))
            my_sql_ids.append(corpus.id)

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

        # setting up indexes
        base_index = faiss.IndexFlatL2(dimension)
        index = faiss.IndexIDMap(base_index)
        my_sql_ids = np.array(my_sql_ids, dtype=np.int64)

        # print("Dimension: ", dimension)
        index.add_with_ids(dense_matrix, my_sql_ids)

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
    # TODO: DO NOT include the unrealised posts
    for faiss_index in indices[0]:
        ids.append(faiss_index)
    return ids


def add(blog_id):
    blog = filtering(Blog.objects.get(id=blog_id).content)
    transformed_data = vectorizer.transform([blog])
    index.add_with_ids(transformed_data.toarray().astype(np.float32), np.array([blog_id]))
    faiss.write_index(index, "tfidf/index.bin")
    print("New blog added successfully")
