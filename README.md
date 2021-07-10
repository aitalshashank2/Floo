<h1 style="text-align: center;">Floo</h1>

**Floo** is a platform for hosting meetings.

## Setup guidelines
- Clone the repository
    ```bash
    git clone https://github.com/aitalshashank2/Floo.git
    cd Floo/
    ```

- Make `backend/code/configuration/config.yml` using `backend/code/configuration/config-stencil.yml`.
    - From the root of the project, run the following commands
        ```bash
        cd ./backend/code/configuration/
        cp config-stencil.yml config.yml
        ```
    - Enter all the required credentials as required.

- Make `postgres/database.env` using `postgres/database-stencil.yml`.
    - From the root of the project, run the following commands
        ```bash
        cd ./postgres/
        cp database-stencil.yml database.yml
        ```
    - Enter all the required credentials as required.

- Make `frontend/src/configuration/config.js` using `frontend/src/configuration/config-stencil.js`
    - From the root of the project, run the following commands
        ```bash
        cd ./frontend/src/configuration/
        cp config-stencil.js config.js
        ```
    - Enter all the required credentials as required.

### Development server

- Go to the project root directory.
- Build the required images using the following command.
    ```bash
    docker-compose -f floo_build/development.yml build
    ```
- To start the Floo Network and all its containers, run the following command.
    ```bash
    docker-compose -f floo_build/development.yml up -d
    ```
- To stop the Floo Network and all its containers, run the following command.
    ```bash
    docker-compose -f floo_build/development.yml down
    ```


### Production server

- Go to the project root directory.
- Build the required images using the following command.
    ```bash
    docker-compose -f floo_build/production.yml build
    ```
- To start the Floo Network and all its containers, run the following command.
    ```bash
    docker-compose -f floo_build/production.yml up -d
    ```
- To stop the Floo Network and all its containers, run the following command.
    ```bash
    docker-compose -f floo_build/production.yml down
    ```
- To rebuild the frontend, use the following command.
    ```bash
    docker-compose -f floo_build/production.yml up frontend
    ```
