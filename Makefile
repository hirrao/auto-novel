dev:
	docker compose -f docker-compose.yml -f docker-compose.debug.yml up -d --build

prod:
	docker compose pull && docker compose up -d

stop:
	docker compose down
