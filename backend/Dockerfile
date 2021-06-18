FROM python:3.9.5-alpine

ENV PYTHONUNBUFFERED 1

# Make a user and group named django and 
RUN addgroup --system django && adduser --system -G django django

# Update the packages and install necessary dependencies
RUN apk update && apk add postgresql-dev \ 
    gcc \
    python3-dev \
    musl-dev \
    libffi-dev \
    openssl-dev \
    jpeg-dev \
    zlib-dev \
    libjpeg \
    cargo

# Upgrade pip and install necessary packages
RUN pip install --upgrade pip \ 
    && pip install --upgrade setuptools \ 
    && pip install --upgrade pipenv \ 
    && pip install --upgrade supervisor

WORKDIR /

COPY ./requirements.txt ./requirements.txt

RUN pip install -r requirements.txt

RUN mkdir -p /static \ 
    && chown -R django:django /static \ 
    && chmod -R o+r /static

RUN mkdir -p /media \ 
    && chown -R django:django /media \
    && chmod -R o+r /media

#  Directories for server logs (in production)
RUN mkdir -p /server_logs/supervisord/ \ 
    && mkdir -p /server_logs/gunicorn/ \ 
    && mkdir -p /server_logs/daphne/ \ 
    && chown -R django:django /server_logs \
    && chmod -R o+r /server_logs

COPY ./supervisord.conf ./supervisord.conf

COPY ./gunicorn.conf.py ./gunicorn.conf.py

RUN chown django:django ./supervisord.conf \ 
    && chown django:django ./gunicorn.conf.py

COPY ./code ./code

WORKDIR /code
