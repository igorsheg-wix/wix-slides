package main

import (
	"embed"
	"flag"
	"fmt"
	"log"
	"net/http"
	"text/template"
	"time"

	"github.com/gorilla/mux"
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

	glue, err := vueglue.NewVueGlue(&config)
	if err != nil {
		log.Fatalln(err)
		return
	}
	vueData = glue

	// Set up our router
	// mux := http.NewServeMux()
	r := mux.NewRouter()
	// r.Use(mux.CORSMethodMiddleware(r))

	// Set up a file server for our assets.
	fsHandler, err := glue.FileServer()
	if err != nil {
		log.Println("could not set up static file server", err)
		return
	}
	r.PathPrefix(config.URLPrefix).Handler(fsHandler)
	r.Handle("/", logRequest(http.HandlerFunc(pageWithAVue)))

	srv := &http.Server{
		Handler: r,
		Addr:    ":4000",

		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())

	// log.Println("Starting server on :4000")
	// err = http.ListenAndServe(":4000", r)
	// log.Fatal(err)
	// and set up your routes and start your server....

}
