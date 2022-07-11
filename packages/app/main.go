package main

import (
	"embed"
	"flag"
	"html/template"
	"igors-wix/wix-slides/handlers"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	vueglue "github.com/torenware/vite-go"
)

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
	r.HandleFunc("/api/me", handlers.UserHandler)

	r.PathPrefix(viteconfig.URLPrefix).Handler(fsHandler)
	r.PathPrefix("/").Handler(logRequest(http.HandlerFunc(pageWithAVue)))

	srv := &http.Server{
		Handler:      r,
		Addr:         ":4000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())

}
