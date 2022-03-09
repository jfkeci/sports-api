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

SMTP_USER=
SMTP_PASSWORD=
SMTP_PORT=
SMTP_HOST=

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