<h1 style="text-align: center;">Floo</h1>

<p align="center">
    <img src="https://img.shields.io/github/license/aitalshashank2/Floo" />
    <img src="https://img.shields.io/tokei/lines/github/aitalshashank2/Floo" />
    <img src="https://img.shields.io/github/issues-pr-closed/aitalshashank2/Floo" />
</p>

**Floo** is a platform for hosting meetings.

# Features
- Google OAuth2.0 for authentication
- Video call between multiple people
- Functionality to mute the audio and stop the video feed
- Preview before joining the video call
- Create and join teams 
- Discuss on the global forum specific to a team
- Team specific meetings
- List of all meetings in a team
- Real time meeting chat
- Chats in the meeting saved
- Chats displayed on the global forum under a meeting
- Team mebers can chat with the meeting participants without joining the meeting in real time
- Screen recording

# Architecture
- The app's backend is made in django and the frontend is made using react. Check their individual folders for more details.
- The app uses docker and docker-compose for enahncing portability.
- Development network structure
    - The following containers are the part of development network :
        - db :
            - This container houses the database for the app.
            - It is built on PostgreSQL latest image.
            - The actual database is stored in a volume so that it is preserved even if we shut the network down.
        - redis :
            - This container acts as a message broker.
            - It is built on the base image of latest redis server.
        - backend :
            - This container houses the backend for the app.
            - In this container, django runs on its development server.
            - The backend code is mounted in this container so that the development server reloads whenever the code (outside the container) changes.
            - It has volumes for storing its static and media files as well.
        - frontend :
            - This container houses the frontend for the app.
            - We run react development server directly in this container.
            - The code and public folders are mounted here so that any changes in these folders are reflected in the container instantly.
    - The following containers are the part of production network
        - db : 
            - It has the same configuration as the one in the development network.
        - redis :
            - It has the same configuration as the one in the development network.
        - backend :
            - This container houses 2 seperate servers for serving WSGI (`gunicorn`) and ASGI (`daphne`) seperately. These servers are maintained by `supervisord`.
            - While starting the container, we collect all the static files required by the backend and put them in the static volume.
            - The media files and the code are mounted in their individual volumes as well.
            - Finally we have a dedicated volume for preserving server logs.
        - frontend :
            - This container makes an optimized build of the code of the frontend and places the code in a volume dedicated to the frontend build.
            - Then, the container exits.
        - reverse_proxy :
            - This container houses Nginx, as the reverse proxy server. We open the ports for http as well as https connections.
            - We mount the configuration files and the SSL certificates for Nginx from their respective folders.
            - Nginx serves the static files and the media files from their respective volumes.
            - It serves the frontend build from its volume as well.
            - All the logs are stored in a dedicated volume.


# Contact Me
Author - <a href="mailto:aitalshashank2@gmail.com">Shashank Aital</a>

# Deployment
[Floo](https://floo.eastus.cloudapp.azure.com/)
