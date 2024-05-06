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
        "status": "200",
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