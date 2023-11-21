# Test unauthenticated POST, expecting a 401 error
POST http://localhost:8080/v1/fragments
Content-Type: text/plain

`Attempt to post without authentication`

HTTP/1.1 401
