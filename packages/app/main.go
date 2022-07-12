package main

import (
	"embed"
	"fmt"
	"html/template"
	"igors-wix/wix-slides/handlers"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/fatih/color"
	"github.com/gorilla/mux"
	vueglue "github.com/torenware/vite-go"
)

var vueData *vueglue.VueGlue
var Environment string

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

func main() {
	Environment = os.Getenv("APP_ENV")
	fmt.Println(Environment)

	r := mux.NewRouter()

	viteconfig := handlers.NewViteConfig(Environment, dist)

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
		Addr:         "0.0.0.0:4000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	color.Green("Starting Wix Slides server")
	fmt.Printf("› Address: %s\n", color.CyanString("http://%s", srv.Addr))

	log.Fatal(srv.ListenAndServe())

}
