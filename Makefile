.PHONY: all start-server start-web test-server test-web build clean

all: start-server start-web

start-server:
	cd server && docker-compose up --build

install-web:
	cd web && npm install

start-web:
	cd web && npm run dev

test-server:
	cd server && python -m app.tests.test_loans

test-web:
	cd web && npm run test

build:
	cd server && docker-compose build
	cd web && npm run build

clean:
	cd server && docker-compose down
	cd web && npm run clean

compile-types:
	cd web && npm run compile