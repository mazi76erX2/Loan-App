# Makefile

.PHONY: all start-server start-web test-server test-web build clean

all: start-server start-web

start-server:
	cd server && docker-compose up --build

start-web:
	cd web && npm run dev

test-server:
	cd server && python -m pytest app/tests/

test-web:
	cd web && npm run test

build:
	cd server && docker-compose build
	cd web && npm run build

clean:
	cd server && docker-compose down
	cd web && npm run clean