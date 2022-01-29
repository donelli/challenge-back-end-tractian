# TRACTIAN Challenge Back-End Software Engineer 

"Not knowing is no reason not to do it, on the contrary. It is the first step to expand your skills" - Bruno Felix, CTO of TRACTIAN.

## About

Imagine the following situation:

Our users, Emerson and Roberta, are maintenance managers at Industria Freios Supremos (auto parts manufacturer), and they have 2 units and 10 assets (machines) in total. They would like to be able to register and view both the units separately, as well as have an overview that condenses the data from the two units.

## CHALLENGE

Build a CRUD where the user can register companies, units, assets and users.

Important:
- Each asset must have an image, name, description, model, owner, status and health level;
- Each asset is part of a unit;
- Each unit is part of a company;
- Every user is part of a company;
- There are three types of status: Running, Alerting, Stopped;
- Health level needs to be between 0% to 100%.

Mandatory:
- Database (MongoDB)
- Engine (NodeJS w/ Express)

Differentials:
- Typescript;
- Design Standard (Clean Code/Clean Architecture).


!!! Please, be able to abstract well the presented problem and define it yourself which data you consider most important. Think with the user's head: What does an industry person need to know about their assets?

In addition to the required libraries, you can use anything else and at the end publish your code on GitHub and deploy the application (Heroku suggestion) because we want to see it online, then send us the links. 🔥

<hr>

## Implementation

### Heroku

This app is deployed to Heroku. Url: [http://challenge-back-end-tractian.herokuapp.com/](http://challenge-back-end-tractian.herokuapp.com/)

### Errors

In case of an error, the API returns the object below describing the error that occurs
```json
{
   "message": "string"
}
```

### Endpoints

- `GET /api/v1/company` - Get all companies
```json
// Response body:
{
   "count": "number",
   "data": [
      {
         "id": "string",
         "name": "string"
      },
   ]
}
```

- `GET /api/v1/company/:id` - Get company by id
```json
// Response body:
{
   "data": {
      "id": "string",
      "name": "string"
   }
}
```

- `POST /api/v1/company` - Create a new company
- `PUT /api/v1/company/:id` - Updates a company
```json
// Request body:
{
   "name": "string"
}

// Response body:
{
   "data": {
      "id": "string",
      "name": "string"
   }
}
```

- `DELETE /api/v1/company/:id` - Delete a company by id

- `GET /api/v1/company/:companyId/user` - Get all users from a company
```json
// Response body:
{
   "count": "number",
   "data": [
      {
         "id": "string",
         "name": "string"
      },
   ]
}
```

- `POST /api/v1/company/:companyId/user` - Create a new user in a specific company
- `PUT /api/v1/company/:companyId/user/:userId` - Updates a user in a specific company
```json
// Request body:
{
   "name": "string"
}

// Response body:
{
   "data": {
      "id": "string",
      "name": "string"
   }
}
```
