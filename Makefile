run: migrate server

db-start:
	docker-compose up mysql

mysql:
	docker compose exec mysql mysql -P3306 -uroot -ppassword
