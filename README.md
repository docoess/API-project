# API-project

[Live Site](https://mod4-api-project-xlx8.onrender.com)

This API-project site is a simple Meetup clone. It has Group and Event listings.

[Wiki](https://github.com/docoess/API-project/wiki)

* [API Docs](https://github.com/docoess/API-project/wiki/API-Documentation)

* [DB Schema](https://github.com/docoess/API-project/wiki/Database-Schema)

* [Current Features](https://github.com/docoess/API-project/wiki/Current-Features)

* [Redux State Shape](https://github.com/docoess/API-project/wiki/Redux-state-shape)

* [Planned Features](https://github.com/docoess/API-project/wiki/Planned-Features)

## Built with:

### Frameworks/Languages:
JavaScript,
HTML5,
CSS3,
Node.js,
Express.js,
React,
Redux

### DB:
Postgres

### Hosting:
Render.com


## LANDING PAGE

Allows for sign-up or login, with demo user account login button available for hassle-free testing.

![landing_page](https://github.com/docoess/API-project/assets/19960142/a9992fd7-33d8-4ab1-afd7-4c828a00b95e)


## Setup

### Backend
cd into the backend dir and
```npm install```

then for DB initialization
```npx dotenv sequelize db:migrate```

followed by
```npx dotenv sequelize db:seed:all```
### NOTE:
If a generic error is thrown while seeding, this may be expected. Check the seeder file holding the demo events, and make sure all seed data has *future* dates, as there is a DB constraint on past dates.

To start the backend server, use
```npm start```

### Frontend
In a new terminal, cd into the frontend dir

Install with a compound command
```npm install && npm install -D```

To run the frontend, use
```npm run dev```

For building, use
```npm run build```
