package handlers

import (
	"embed"

	vueglue "github.com/torenware/vite-go"
)

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
