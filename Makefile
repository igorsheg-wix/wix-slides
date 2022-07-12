
APP_DIR=packages/app
WEB_DIR=packages/app/web
INSTALL_ONCE=$(JS_DIR)
CONFIG_FILE := vite.config.ts
VITE_PORT=3000
GO_APP_PORT=4000

dev: 
	@echo starting dev envioemrnt
	@cd $(WEB_DIR); yarn dev --logLevel silent &
	@cd $(APP_DIR); APP_ENV=development DOMAIN=localhost PORT=4000 go run .


build-web:
	@echo building web app
	@-pkill -SIGTERM -f "yarn build"
	@cd $(WEB_DIR); yarn; yarn build 

build-backend:
	@echo building backend
	@cd $(APP_DIR); CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -ldflags="-w -s" -o wix-slides .


preview: 
	@echo starting prodction app
	@cd $(APP_DIR); ./wix-slides.sh

build: 
	@echo building app
	@make build-web; make build-backend

clean: 
	@echo cleaing dev enviorment
	cd $(APP_DIR); rm wix-slides & rm -rf web/dist


