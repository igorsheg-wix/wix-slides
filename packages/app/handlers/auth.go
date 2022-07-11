package handlers

import (
	"bytes"
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/gob"
	"encoding/json"
	"fmt"
	"igors-wix/wix-slides/models"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var conf *oauth2.Config
var store = sessions.NewCookieStore([]byte("something-very-secret"))
var state string

// var environment string

func randToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

func jsonPrettyPrint(in string) string {
	var out bytes.Buffer
	err := json.Indent(&out, []byte(in), "", "\t")
	if err != nil {
		return in
	}
	return out.String()
}

func init() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("No .env file")
	}

	store.Options = &sessions.Options{
		Domain:   "localhost",
		Path:     "/",
		MaxAge:   3600 * 8,
		HttpOnly: true,
	}

	gob.Register(models.User{})

	conf = &oauth2.Config{
		RedirectURL:  "http://localhost:4000/oauth/callback",
		ClientID:     os.Getenv("CLIENT_ID"),
		ClientSecret: os.Getenv("CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
	// fmt.Println("Google ouath config -------->", jsonPrettyPrint(conf))

	empJSON, err := json.MarshalIndent(conf, "", "  ")
	if err != nil {
		log.Fatalf(err.Error())
	}
	fmt.Printf("MarshalIndent funnction output %s\n", string(empJSON))
}

func httpError(w http.ResponseWriter, err error, reason string) {
	fmt.Println(reason)
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func OauthGoogleLogin(w http.ResponseWriter, r *http.Request) {

	state = randToken()
	store, err := store.Get(r, "session")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	store.Values["state"] = state
	store.Save(r, w)

	u := conf.AuthCodeURL(state)
	http.Redirect(w, r, u, http.StatusTemporaryRedirect)
}

func OauthGoogleCallback(w http.ResponseWriter, r *http.Request) {
	store, err := store.Get(r, "session")
	if err != nil {
		httpError(w, err, "Getting store")
		return
	}
	query := r.URL.Query()
	retrievedState := store.Values["state"]
	if retrievedState != query.Get("state") {
		httpError(w, err, "Getting state from store")
		return
	}

	token, err := conf.Exchange(context.Background(), query.Get("code"))
	if err != nil {
		httpError(w, err, "token bit")
		return
	}
	client := conf.Client(context.Background(), token)
	email, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil {
		httpError(w, err, "email bit")
		return
	}
	defer email.Body.Close()
	data, _ := ioutil.ReadAll(email.Body)
	user := models.User{}
	json.Unmarshal(data, &user)
	store.Values["user"] = user
	store.Save(r, w)
	fmt.Println("Email body: ", user)

	db, err := sql.Open("sqlite3", "./foo.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// sqlStmt := `
	// create table foo (id integer not null primary key, name text);
	// delete from foo;
	// `
	// _, err = db.Exec(sqlStmt)
	// if err != nil {
	// 	log.Printf("%q: %s\n", err, sqlStmt)
	// 	return
	// }

	http.Redirect(w, r, "/", http.StatusMovedPermanently)

}

// func LogginMiddleware(w http.ResponseWriter, r *http.Request) {
// 	session, err := store.Get(r, "session")
// 	if err != nil {
// 		httpError(w, err, "getting session")
// 		return
// 	}
// 	v := session.Values["user"]

// 	if v == nil {
// 		httpError(w, err, "Failed fetching user from session")
// 		http.Redirect(w, r, "/login", http.StatusMovedPermanently)
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(v)
// }

func LogginMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		session, err := store.Get(r, "session")
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusMovedPermanently)
		}

		v := session.Values["user"]
		if v == nil {
			http.Redirect(w, r, "/login", http.StatusMovedPermanently)
		}

		next.ServeHTTP(w, r)
	})
}
