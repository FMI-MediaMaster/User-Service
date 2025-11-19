# User Service

This is the backend microservice for Users.
The service runs on port 8001 by default.

## 🌐 Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /auth/signup      | Create a user |
| POST   | /auth/signin      | Authenticate a user |
| PUT    | /auth/signout     | Terminate session for a user |


### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /user/   | View a user's details |
| PUT    | /user/   | Update a user |
| DELETE | /user/   | Delete a user |
