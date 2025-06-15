import math

import numpy as np
import faiss
import nltk
from django.utils import timezone
from langdetect import detect
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import SnowballStemmer
import string
import os
from joblib import dump, load
from collections import Counter

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


def filtering(blog):
    try:
        sample_text = blog[:min(len(blog), 1000)]
        language = iso_to_nltk.get(detect(sample_text), 'english')
    except Exception:
        language = 'english'
    # a blogtartalmának megfelelő nyelv stop szavainak beállítása
    try:
        stop_words = set(stopwords.words(language))
    except LookupError:
        stop_words = set()

    # szavakra bontás
    words = word_tokenize(blog)

    # stopszavak, inrásjelek szűrése
    filtered_words = [word.lower() for word in words if
                      word.lower() not in stop_words and word not in string.punctuation]
    try:
        # szótővesítés
        stemmer = SnowballStemmer(language)
        stemmed_words = [stemmer.stem(word) for word in filtered_words]
        return " ".join(stemmed_words)
    except ValueError:
        return " ".join(filtered_words)


def create_vector(corpus):
    df = {}
    N = len(corpus)

    for doc in corpus:
        unique_words = set(word_tokenize(doc))
        for word in unique_words:
            # szavak gyakoriságának számítása
            df[word] = df.get(word, 0) + 1

    min_df = max(2, int(0.01 * N))
    max_df = int(0.8 * N)

    filtered_vocab = {word: freq for word, freq in df.items()
                      if min_df <= freq <= max_df}

    vocab = {}
    filtered_df = {}
    for i, word in enumerate(filtered_vocab.keys()):
        vocab[word] = i
        filtered_df[word] = df[word]

    print(f"Vocabulary size: {len(vocab)} terms after filtering from {len(df)} original terms")

    return N, filtered_df, vocab


def create_transform(document):
    global vectorizer_data

    # a dokumentum TF-IDF vektorának létrehozása
    N, df, vocab = vectorizer_data
    words = word_tokenize(document)
    word_counts = Counter(words)

    vector = np.zeros(len(vocab), dtype=np.float32)

    for word, idx in vocab.items():
        if word in word_counts:
            tf = 1 + math.log(word_counts[word]) if word_counts[word] > 0 else 0
            idf = math.log((N + 1) / (df[word] + 1)) + 1
            vector[idx] = tf * idf

    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm

    return vector


def create_fit(corpus):
    global vectorizer_data
    N, df, vocab = vectorizer_data
    matrix = np.zeros((len(corpus), len(vocab)), dtype=np.float32)
    for i, doc in enumerate(corpus):
        matrix[i] = create_transform(doc)

    return matrix


def test_tfidf_quality():
    from sklearn.metrics.pairwise import cosine_similarity

    corpora = Blog.objects.filter(visible=True, date__lte=timezone.now())
    filtered_corpus = []
    for corpus in corpora:
        filtered_corpus.append(filtering(corpus.content))

    global vectorizer_data
    vectorizer_data = create_vector(filtered_corpus)
    tfidf_matrix = create_fit(filtered_corpus)

    similarities = cosine_similarity(tfidf_matrix)

    np.fill_diagonal(similarities, 0)

    print(f"Average similarity: {similarities.mean():.3f}")
    print(f"Max similarity: {similarities.max():.3f}")
    print(f"Standard deviation: {similarities.std():.3f}")


def setup():
    global vectorizer_data, index
    index_path = 'tfidf/index.bin'
    vectorizer_path = 'tfidf/vectorizer.joblib'
    # initialize vectorizer and creating a fit
    if not os.path.exists(index_path) or not os.path.exists(vectorizer_path):
        corpora = Blog.objects.filter(visible=True, date__lte=timezone.now())
        filtered_corpus = []
        my_sql_ids = []
        for corpus in corpora:
            filtered_corpus.append(filtering(corpus.content))
            my_sql_ids.append(corpus.id)

        print('Creating vectorizer...')
        vectorizer_data = create_vector(filtered_corpus)
        fit = create_fit(filtered_corpus)

        # saving the vectorizer
        dump(vectorizer_data, vectorizer_path)

        # setting up faiss
        print('Setting up FAISS...')
        dimension = fit.shape[1]

        # setting up indexes
        base_index = faiss.IndexFlatIP(dimension)
        index = faiss.IndexIDMap(base_index)
        my_sql_ids = np.array(my_sql_ids, dtype=np.int64)

        index.add_with_ids(fit, my_sql_ids)

        # saving faiss index
        faiss.write_index(index, index_path)
        print('Everything is set up and saved to the drive')
    else:
        # loading the index and vectorizer that was already made once
        print("Loading necessary files...")
        vectorizer_data = load(vectorizer_path)
        index = faiss.read_index(index_path)


def search(blog, k=1):
    print("Searching for similar blogs...")

    # a lekérdezett blog szövegének előkészítése
    query = filtering(blog.content)
    query_vector = np.array([create_transform(query)], dtype=np.float32)
    distances, indices = index.search(query_vector, k=(k + 1))
    print("FAISS search result:")
    print(distances, indices)

    # az eredmények feldolgozása és a blog id-k visszaküldése
    ids = set()
    for faiss_index in indices[0]:
        ids.add(faiss_index)
    ids.discard(blog.id)
    return list(ids)[:3]


def add(blog_id):
    # blog feldolgozása és TF-IDF vektor létrehozása és hozzáadása FAISS-hoz
    blog = filtering(Blog.objects.get(id=blog_id).content)
    transformed_data = np.array([create_transform(blog)], dtype=np.float32)
    index.add_with_ids(transformed_data, np.array([blog_id]))
    faiss.write_index(index, "tfidf/index.bin")
    print("New blog added successfully")


def delete(blog_id):
    # blog eltávolítása a FAISS indexből
    index.remove_ids(np.array([blog_id]))
    faiss.write_index(index, "tfidf/index.bin")
    print("Blog deleted successfully")
