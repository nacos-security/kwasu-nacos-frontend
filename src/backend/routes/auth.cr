#am supposed to add so many security checks but lets just make this simple and not complicate lol 
require "kemal"
require "../controllers/auth"


post "/api/signup" do |env|
 email = env.params.json["email"].as(String)
 pswd = env.params.json["password"].as(String)
 signup = Controllers.signup(email, pswd)
 signup.to_json
 end
 
 post "/api/login" do |env|
   email = env.json.params["email"].as(String)
   pswd = env.params.json["pswd"].as(String)
   login = Controllers.login(email, pswd)
   login.to_json
 end