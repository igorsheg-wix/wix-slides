package handlers

import (
	"context"
	"crypto/rand"
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
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var conf *oauth2.Config
var store = sessions.NewCookieStore([]byte("something-very-secret"))
var state string

func randToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

func init() {
	store.Options = &sessions.Options{
		Domain:   "localhost",
		Path:     "/",
		MaxAge:   3600 * 8, // 8 hours
		HttpOnly: true,
	}
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Some error occured. Err: %s", err)
	}
	gob.Register(models.User{})

	conf = &oauth2.Config{
		RedirectURL:  "http://localhost:4000/oauth/callback",
		ClientID:     os.Getenv("CLIENT_ID"),
		ClientSecret: os.Getenv("CLIENT_SECRET"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
		Endpoint:     google.Endpoint,
	}
}

func httpError(w http.ResponseWriter, err error, reason string) {
	fmt.Println(reason)
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func OauthGoogleLogin(w http.ResponseWriter, r *http.Request) {

	// oauthState := generateStateOauthCookie(w)

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

	http.Redirect(w, r, "/", http.StatusMovedPermanently)

}

func UserHandler(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "session")
	if err != nil {
		httpError(w, err, "getting session")
		return
	}
	v := session.Values["user"]

	if v == nil {
		httpError(w, err, "Failed fetching user from session")
		// http.Redirect(w, r, "/login", http.StatusMovedPermanently)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}
