package config

import (
	"embed"
	"fmt"
	"os"

	vueglue "github.com/torenware/vite-go"
)

type AppConfig struct {
	OauthRedirectURL string
}

func NewAppConfig(enviorment string) *AppConfig {

	var config AppConfig

	fmt.Println("From NewAppConfig ----->", enviorment)

	if enviorment == "development" {
		config.OauthRedirectURL = "http://" + os.Getenv("DOMAIN") + ":" + os.Getenv("PORT") + "/oauth/callback"
	} else if enviorment == "production" {
		config.OauthRedirectURL = "https://" + os.Getenv("DOMAIN") + "/oauth/callback"
	}

	return &config
}

func NewViteConfig(environment string, fs embed.FS) vueglue.ViteConfig {
	if environment == "development" {
		return vueglue.ViteConfig{
			Environment: "development",
			AssetsPath:  "web",
			EntryPoint:  "src/main.tsx",
			URLPrefix:   "/src/",
			Platform:    "react",
			FS:          fs,
		}
	} else if environment == "production" {
		return vueglue.ViteConfig{
			Environment: "production",
			AssetsPath:  "web/dist",
			EntryPoint:  "src/main.js",
			URLPrefix:   "/assets/",
			Platform:    "react",
			FS:          fs,
		}
	} else {
		panic("No enviorment spesificed")
	}

}
