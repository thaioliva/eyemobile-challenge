# EYEMOBILE Challenge

## API Cartões Ltda

### Setup
```sh
$ git clone https://github.com/thaioliva/eyemobile-challenge.git
$ npm install
$ cp .env.example .env
```

API
Documentação: https://github.com/thaioliva/eyemobile-challenge-doc
Dump mongodb (pasta): dump-eyeMobile
Para restaurar o db:
```sh
$ mongorestore --db {DATABASE} --verbose dump-eyeMobile/dump
```

### Config .ENV
- PORT=3000
- SECRET=
- MONGO_CONNECTION=
- DATABASE=
- DEBIT=2
- CREDIT=3
- CREDIT_DAYS=30

### Start server
Em modo dev:
```sh
$ npm run dev
```
Em modo prod:
```sh
$ npm start
```
