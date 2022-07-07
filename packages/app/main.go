package main

import (
	"embed"
	"flag"
	"fmt"
	"log"
	"net/http"
	"text/template"

	vueglue "github.com/torenware/vite-go"
)

type Config struct {
	assets       string
	jsEntryPoint string
	URLPrefix    string
}

var appConfig Config
var vueData *vueglue.VueGlue
var environment string

//go:embed "web"
var dist embed.FS

func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s - %s %s %s", r.RemoteAddr, r.Proto, r.Method, r.URL.RequestURI())
		next.ServeHTTP(w, r)
	})
}

func pageWithAVue(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("./index.tmpl")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Print(&vueData)
	t.Execute(w, vueData)
}

func init() {
	flag.StringVar(&environment, "env", "development", "development|production")
	// flag.StringVar(&assets, "assets", "frontend", "location of javascript files. dist for production.")
	// flag.StringVar(&jsEntryPoint, "entryp", "src/main.js", "relative path of the entry point of the js app.")
	// flag.StringVar(&platform, "platform", "vue", "vue|react|svelte")
	flag.Parse()

	if environment == "development" {
		appConfig.assets = "web"
		appConfig.jsEntryPoint = "src/main.tsx"
		appConfig.URLPrefix = "/src/"
	} else if environment == "production" {
		appConfig.assets = "web/dist"
		appConfig.jsEntryPoint = "src/main.js"
		appConfig.URLPrefix = "/assets/"
	}

	fmt.Println(environment)
}

func main() {

	var config vueglue.ViteConfig

	config.Environment = environment
	config.AssetsPath = appConfig.assets
	config.EntryPoint = appConfig.jsEntryPoint
	config.Platform = "react"
	config.URLPrefix = appConfig.URLPrefix
	config.FS = dist

	// if environment == "production" {
	// 	config.URLPrefix = "/assets/"
	// } else if environment == "development" {
	// 	config.URLPrefix = "/src/"
	// } else {
	// 	log.Fatalln("illegal environment setting")
	// }

	glue, err := vueglue.NewVueGlue(&config)
	if err != nil {
		log.Fatalln(err)
		return
	}
	vueData = glue

	// Set up our router
	mux := http.NewServeMux()

	// Set up a file server for our assets.
	fsHandler, err := glue.FileServer()
	if err != nil {
		log.Println("could not set up static file server", err)
		return
	}
	mux.Handle(config.URLPrefix, fsHandler)
	mux.Handle("/", logRequest(http.HandlerFunc(pageWithAVue)))

	log.Println("Starting server on :4000")
	err = http.ListenAndServe(":4000", mux)
	log.Fatal(err)
	// and set up your routes and start your server....

}
