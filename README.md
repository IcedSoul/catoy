Welcome to Catoy, let's do some cat stuff!
looking for fun? you're in the right place!


## Environment
node version > 18.15.5

## Getting Started

```bash
npm install
# or
yarn install

# run dev
npm run dev
# or
yarn dev
```

## Structure
this project is based on next.js 13 and Mantine UI, using next-auth for authentication. 

next app directory is the new feature of next.js 13.

the code structure is like this:
```
- src                                   # source code
  - pages                               # old version of next.js, just for next-auth, which is not support next app directory.
    - api
        - auth
            - [...nextauth].ts          # next-auth all config

  - app                                 # app directory
    - api                               # all api defined here
        - ...
    - components                        # most components of page
        - ...
    - page.tsx                          # index page
    - layout.tsx                        # global layout config
- public                                # static files
- next.config.js                        # next.js config
- tsconfig.json                         # typescript config
- package.json                          # npm config
- README.md                             #this file
```

## Build & Deploy

before build, you need to do some configuration.

1. set the environment variables in `.env.production` file.
2. generate ssh key and copy the public key to the server.
3. install docker and docker-compose.
4. login docker registry with specify password. 

Then, run deploy.bat and wait, the website will be deployed to the server.