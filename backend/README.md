<h1 style="text-align: center;">Floo - Backend</h1>

<p align="center">
    <img src="https://img.shields.io/docker/cloud/automated/aitalshashank2/floo-backend.svg" />
    <img src="https://img.shields.io/docker/cloud/build/aitalshashank2/floo-backend.svg" />
</p>

This directory houses the backend for **Floo**.

## Tech Stack
- [Django](https://www.djangoproject.com/)
- [Django Rest Framework](https://www.django-rest-framework.org/)
- [Django Channels](https://channels.readthedocs.io/en/stable/)
- **Gunicorn**: As WSGI backend server
- **Daphne**: As ASGI backend server
- **psycopg2**: Database Engine
- **supervisord**: As a process control system for the servers

## Associated Repositories
- [Docker Hub](https://hub.docker.com/repository/docker/aitalshashank2/floo-backend)
