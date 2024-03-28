run-server:
	node server/server.js

run-client:
	cd client/ && ng serve -o

load-database:
	./JsonBD/LoadBD.sh