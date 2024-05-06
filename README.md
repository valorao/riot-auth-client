# Riot Auth API

## Endpoints
### `/api/riot/auth`

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

- Method: `GET`

```js
    {
        "version": str
    }

```

### `/api/riot/client/platform`

- Method: `GET`

```js
    {
        "platform": str
    }

```

### `/api/riot/player/party`

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