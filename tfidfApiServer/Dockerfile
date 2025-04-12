FROM continuumio/miniconda3:main
WORKDIR /usr/app/

RUN conda create -n myenv python=3.9 -y
SHELL ["conda", "run", "-n", "myenv", "/bin/bash", "-c"]
RUN conda install -c conda-forge faiss-cpu -y
RUN conda install django -y

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . ./

CMD ["conda", "run", "-n", "myenv", "python", "manage.py", "runserver", "0.0.0.0:8000"]