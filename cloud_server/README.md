Simple API server for StudyMaster

Endpoints:
- POST /new -> returns { id }
- POST /save/:id -> body: { gameData, question_status } saves data
- GET /load/:id -> returns saved data for id or 404

Run:
1. cd cloud_server
2. npm install
3. node index.js

Server listens on port 3000 by default.

Note: This is a minimal example for local testing. For production use a proper database and authentication.
