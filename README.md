# Riot Auth API

## Endpoints
### `/api/riot/auth`
Authenticates user to Riot with Username and password.
- Method: `POST`

- Body:
```js
    {
    "username": "",
    "password": ""
    }

  ```
- Response:

  ```js
    {
        "status": 200,
        "riotid": "RIOT_ID#TAGLINE",
        "Bearer": str
        "Expires in": int
        "entitlements": str
    }
  ```

### `/api/riot/client/version`
Gather Riot Client's Version, needed in some endpoints.
- Method: `GET`

```js
    {
        "version": str
    }

```

### `/api/riot/client/platform`
Gather Riot Client's Platform, neeed in some endpoints.
- Method: `GET`

```js
    {
        "platform": str
    }

```

### `/api/riot/player/party`
Gather Player's Party ID.
- Method: `POST`

- Body:
```js
    {
    "token": "",
    "puuid": "",
    "entitlements": "",
    "client_platform: "",
    "client_version": ""
    }

  ```
- Response:

  ```js
    {
        "status": 200,
        "party_id": str,
    }
  ```

### `/api/riot/player/pregame`
Gather Player's Pregame ID.
- Method: `POST`

- Body:
```js
    {
    "token": "",
    "puuid": "",
    "entitlements": "",
    "client_platform: "",
    "client_version": ""
    }

  ```
- Response:

  ```js
    {
        "status": 200,
        "pregame_id": str,
    }
  ```

### `/api/riot/player/pregame/leave`
Leave the Pregame (also known as Dodge).
- Method: `POST`

- Body:
```js
    {
    "token": "",
    "pregame_id": "",
    "entitlements": "",
    "client_platform: "",
    "client_version": ""
    }

  ```
- Response:

  ```js
    {
        "status": 204
    }
  ```

### `/api/riot/actions/player/pregame/leave`
Leave the Pregame with login, instead of token. (also known as Dodge).
- Method: `POST`

- Body:
```js
    {
    "username": "",
    "password": ""
    }

  ```

  - Response:

  ```js
    {
        "status": 204
    }
  ```