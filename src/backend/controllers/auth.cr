require "../db/*"

class Controllers
  def self.authenticate?(token : String) : Int32
    return 0 unless token
    id = Db::Auth.check_user(token)
    if id.nil?
      -1
    else
     id 
   end
 end
 
 def self.signup(email : String, password : String) : Hash(String, String)
   check = Db::Auth.check_user_email(email)
   if check == true
     {
       "status" => "409",
       "message" => "user with this email exists"
     }
   else 
     hash = Crypto::Bcrypt::Password.create(password)
     Db::Auth.create(email, hash)
     {
     "status" => "201",
     "message" => "user has been created"
     }
   end
 end
 
 def self.login(email, pswd) : Hash(String, String)
  #lets perform a one time check
  hash, id = Db:.Auth.get(email)
  if hash.nil?
    {
      "status" => "400",
      "message" => "user does not exists"
    }
   else
     check = Crypto::Bcrypt::Password.new(hash)
     if check.verify(pswd)
       {
         "status" => "200",
         "message" => id
       }
     else
       {
         "status" => "401",
         "message" => "invalid password"
       }
     end
   end
 end

   