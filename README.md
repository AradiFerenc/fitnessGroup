# VideoShareMEAN

This is a fitness group manager platform project written in the MEAN stack created for the Program System Development course.

## Requirements

Node.js
Angular
Docker

## Setup

Clone the project

### Docker setup

Navigate to the root folder

Build docker image: docker build -t db .

Run docker container: dokcer run -it --name db -p 6000:21017 my-mongo-image

### Server side setup

Navigate to the server folder

Install node packages: npm install

Run server: npm run serve (This also runs tsc for typescript)

### Client side setup

Install angular cli: npm install -g @angular/cli

Navigate to the frontend folder

Install node packages: npm install

Run frontend: ng serve

## Result

If everything went according to plan you can now view the site at localhost:4200