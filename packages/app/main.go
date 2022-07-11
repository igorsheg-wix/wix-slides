package main

import (
	"embed"
	"flag"
	"fmt"
	"html/template"
	"igors-wix/wix-slides/handlers"
	"log"
	"net/http"
	"time"

	"github.com/fatih/color"
	"github.com/gorilla/mux"
	vueglue "github.com/torenware/vite-go"
)

var vueData *vueglue.VueGlue
var environment string

//go:embed "web"
var dist embed.FS

//go:embed "index.tmpl"
var htmlTemplate embed.FS

func logRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s - %s %s %s", r.RemoteAddr, r.Proto, r.Method, r.URL.RequestURI())
		next.ServeHTTP(w, r)
	})
}

func pageWithAVue(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFS(htmlTemplate, "index.tmpl")
	if err != nil {
		log.Fatal(err)
	}

	t.Execute(w, vueData)
}

func init() {
	flag.StringVar(&environment, "env", "development", "development|production")
	flag.Parse()

}

func main() {

	r := mux.NewRouter()

	viteconfig := handlers.NewViteConfig(environment, dist)

	glue, err := vueglue.NewVueGlue(&viteconfig)
	if err != nil {
		log.Fatalln(err)
		return
	}
	vueData = glue

	fsHandler, err := glue.FileServer()
	if err != nil {
		log.Println("could not set up static file server", err)
		return
	}

	authApi := r.PathPrefix("/oauth").Subrouter()
	authApi.HandleFunc("/login", handlers.OauthGoogleLogin)
	authApi.HandleFunc("/callback", handlers.OauthGoogleCallback)

	r.PathPrefix(viteconfig.URLPrefix).Handler(fsHandler)
	r.PathPrefix("/login").Handler(http.HandlerFunc(pageWithAVue))
	r.PathPrefix("/editor").Handler(handlers.LogginMiddleware(logRequest(http.HandlerFunc(pageWithAVue))))
	r.PathPrefix("/").Handler(http.HandlerFunc(pageWithAVue))

	srv := &http.Server{
		Handler:      r,
		Addr:         "localhost:4000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	color.Green("Starting Wix Slides server")
	// color.Green(">", "Local")
	fmt.Printf("› Address: %s\n", color.CyanString("http://%s", srv.Addr))

	log.Fatal(srv.ListenAndServe())

}
