# Project for Docker Learing Program

This project contains 2 services that work according to https://git.epam.com/epm-cdp/global-java-foundation-program/java-courses/-/blob/main/introduction-to-microservices/tasks/microservice_architecture_overview/README.md.

## Configuration (Required Env Variables)
### Resource Service
* `PORT` - port number (e.g. `PORT=3000`)
* `MONGO_URI` - URI to MongoDB (e.g. `MONGO_URI=mongodb://127.0.0.1:27017/resource`)
* `SONG_SERVICE_URL` - URL for song service `SONG_SERVICE_URL=http://localhost:3001`

### Song Service
* `PORT` - port number (e.g. `PORT=3001`)
* `MONGO_URI` - URI to MongoDB (e.g. `MONGO_URI=mongodb://127.0.0.1:27017/song`)
