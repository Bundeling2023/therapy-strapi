---
title: Strapi
description: A self-hosted version of Strapi using a Postgres database
tags:
  - strapi
  - postgresql
  - cms
  - javascript
---

# Strapi example

This example deploys self-hosted version of [Strapi](https://strapi.io/). Internally it uses a PostgreSQL database to store the data.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/strapi?referralCode=milo)

## ✨ Features

- Strapi
- Postgres

## 💁‍♀️ How to use

- Click the Railway button 👆
- Add the environment variables
  - If you do not add the Cloudinary related environment variables, your images/files will not be persisted between deploys.

## 📝 Notes

- After your app is deployed, visit the `/admin` endpoint to create your admin user.
- Railway's filesystem is ephemeral which is why any changes to the filesystem are not persisted between deploys. This is why, this example uses Cloudinary for storage.

# Local development


* Add a .env file with all the variables that are in [.env.example](.env.example)
  * Keys can be generated using: \
  `node -e "console.log(crypto.randomBytes(16).toString('base64'))"`
* Run postgres locally using docker

```
docker run \
    --name bundeling-strapi \
    -p 5432:5432 \
    -e POSTGRES_USER=strapi \
    -e POSTGRES_PASSWORD=password \
    -e POSTGRES_DB=strapi \
    -d \
    postgres \
```

* Run `npm run develop`
