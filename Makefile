
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

preview: 
	@echo previewing app
	@-pkill -SIGTERM -f "yarn build"
	@cd $(WEB_DIR); yarn build &
	@cd $(APP_DIR); go run . -env production 

build: 
	@echo building app
	@-pkill -SIGTERM -f "yarn build"
	@cd $(WEB_DIR); yarn build &
	@cd $(APP_DIR); go build . -env production 




