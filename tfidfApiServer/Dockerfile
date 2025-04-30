FROM continuumio/miniconda3:main
WORKDIR /usr/app/

RUN conda create -n myenv python=3.10 faiss-cpu -c conda-forge -y

COPY requirements.txt .
SHELL ["/bin/bash", "-c"]
RUN source activate myenv && pip install --upgrade pip && pip install -r requirements.txt

ENV PATH /opt/conda/envs/myenv/bin:$PATH
ENV CONDA_DEFAULT_ENV=myenv

COPY . ./

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]