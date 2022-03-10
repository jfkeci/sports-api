# sports-api

### setup

#### 1. Clone the repo and install packages
```bash
git clone https://github.com/jfkeci/sports-api.git
```

```bash
cd sports-api
```

```bash
npm install
```



#### 2. setup .env file

NODE_ENV=development

PORT=13374

API_URL=http://localhost:13374/

DB_USER=

DB_PASSWORD=

DB_DATABASE=

SECRET=

#### 3. Run dev on http://localhost:13374/
```bash
npm run dev
```




### Dockerize


#### 1. Make sure you download and install docker on your system


#### 2. Build the container
```bash
docker build -t sports-api .
```


#### 2. Run the app
```bash
docker run -p 13374:13374 sports-api
```



### Don't forget to set access token env variables after logging in user and admin in postman
 ![Create a new user in postman](/assets/postman-env.png)



## Creating a new user and email verification

Register user and confirm email example
#### 1. Create a new user in postman
 ![Create a new user in postman](/assets/create-new-user.png)

#### 2. Click the email preview url in app console to open email in browser
 ![Example email - user verification](/assets/email-verification-preview.png)

#### 3. Confirm email

Click Confirm email button

 ![Email preview - user verification](/assets/verify-user-example-email.png)

#### 4.
 ![User is verified](/assets/user-verified.png)




 ## Password reset example

Reset user account password example
 #### 1. Make user verification request 
 route: /api/users/verify/:id/:confirmationCode

 ![Forgot password request](/assets/forgot-password-request.png)

 #### 2. Click the email preview url in app console to open email in browser
 ![Example email - password reset](/assets/reset-password-example-email.png)
 
 #### 3. You can see the password reset code and user id
 ![Email preview - password reset](/assets/email-password-reset-preview.png)

 #### 4. Make password reset request 
 route: /api/users/password/reset/:id/:passwordResetCode
 body: {
    "password": "password1234",
    "confirmPassword": "password1234"
 }


 ![Password reset](/assets/user-verified.png)
