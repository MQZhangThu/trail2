Main Technique Focus:

1. Back-end based on KOA;
2. KOA Sequelize to manage the DB;
3. JWT
4. HTML5 localStorage for storing tokens (implemented on client-side JS (public/js/main.js))

Scenario:

- The user submits the email and password to the server;
- The server generates a JSON WEB TOKEN with expire time, and then sends the token back to the browser client;
- The JWT token is stored in the DB using Sequelize, to support server-side token validation
- Browser client will store the JWT using HTML5 localStorage ( the token can be attached in the header each time when send requests to the server)
- When the browser jumps to the welcom.html, the token will be read from localStorage and displayed.

How to run:

1. modify ./config/dbconfig.json to properly configure the DB
2. npm install necessary modules (koa, koa-static, koa-router, co-body, moment, jwt-simple)
3. node --harmony app

Optional: 

You can change the secret string defined in the file ./config/secretconfig.json
