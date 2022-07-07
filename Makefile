
APP_DIR=packages/app
WEB_DIR=packages/app/web
INSTALL_ONCE=$(JS_DIR)
CONFIG_FILE := vite.config.ts
VITE_PORT=3000
GO_APP_PORT=4000

dev: 
	@echo starting dev server
	@-pkill -SIGTERM -f "yarn dev"
	@cd $(WEB_DIR); yarn dev &
	@cd $(APP_DIR); go run . -env development


build-web:
	@echo building web app
	@-pkill -SIGTERM -f "yarn build"
	@cd $(WEB_DIR); yarn build 

build-backend:
	@echo building backend
	@cd $(APP_DIR); go build -o wix-slides.sh

build: 
	@echo building app
	@make build-web; make build-backend

clean: 
	@echo cleaing dev enviorment
	cd $(APP_DIR); rm wix-slides.sh & rm -rf web/dist


