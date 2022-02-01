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
```jsonc
{
   "message": "string"
}
```

### Endpoints

#### Companies

- `GET /api/v1/companies` - Get all companies
```jsonc
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

- `GET /api/v1/companies/:id` - Get company by id
```jsonc
// Response body:
{
   "data": {
      "id": "string",
      "name": "string"
   }
}
```

- `POST /api/v1/companies` - Create a new company
- `PUT /api/v1/companies/:id` - Updates a company
```jsonc
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

- `DELETE /api/v1/companies/:id` - Delete a company by id

#### Users

- `GET /api/v1/companies/:companyId/users` - Get all users from a company
```jsonc
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

- `GET /api/v1/companies/:companyId/users/:userId` - Get a user by id in a specific company
```jsonc
// Response body:
{
   "data": {
      "id": "string",
      "name": "string"
   }
}
```

- `POST /api/v1/companies/:companyId/users` - Create a new user in a specific company
- `PUT /api/v1/companies/:companyId/users/:userId` - Updates a user in a specific company
```jsonc
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

- `DELETE /api/v1/companies/:companyId/users/:userId` - Delete a company by id

#### Units

- `GET /api/v1/companies/:companyId/units` - Get all units from a company
```jsonc
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

- `GET /api/v1/companies/:companyId/units/:unitId` - Get a unit by id in a specific company
```jsonc
// Response body:
{
   "data": {
      "id": "string",
      "name": "string"
   }
}
```

- `POST /api/v1/companies/:companyId/units` - Create a new unit in a specific company
- `PUT /api/v1/companies/:companyId/units/:unitId` - Updates a unit in a specific company
```jsonc
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

- `DELETE /api/v1/companies/:companyId/units/:unitId` - Delete a company by id

#### Assets

- `POST /api/v1/uploadAssetImage` - Uploads a image for an asset

- `GET /api/v1/companies/:companyId/units/:unitId/assets` - Get all assets from a unit
```jsonc
// Response body:
{
   "count": "number",
   "data": [
      {
         "id": "string",
         "name": "string",
         "description": "string",
         "model": "string",
         "owner": "string (owner ID)",
         "image": "string (image URL)",
         "health_level": "number",
         "status": "RUNNING | ALERTING | STOPPED"
      },
   ]
}
```

- `GET /api/v1/companies/:companyId/units/:unitId/assets/:assetId` - Get a asset by id in a specific company and unit
```jsonc
// Response body:
{
   "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "model": "string",
      "owner": "string (owener ID)",
      "image": "string (image URL)",
      "health_level": "number",
      "status": "stringEnum: RUNNING | ALERTING | STOPPED"
   }
}
```

- `POST /api/v1/companies/:companyId/units/:unitId/assets/` - Create a new asset in a specific company and unit
- `PUT /api/v1/companies/:companyId/units/:unitId/assets/:assetId` - Updates a asset in a specific company and unit
```jsonc
// Request body:
{
   "name": "string",
   "description": "string",
   "model": "string",
   "ownerId": "string (owner ID)",
   "imageId": "string (fileName returned by '/api/v1/uploadAssetImage')",
   "health_level": "number",
   "status": "stringEnum: RUNNING | ALERTING | STOPPED"
}

// Response body:
{
   "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "model": "string",
      "owner": "string (owener ID)",
      "image": "string (image URL)",
      "health_level": "number",
      "status": "stringEnum: RUNNING | ALERTING | STOPPED"
   }
}
```

- `DELETE /api/v1/companies/:companyId/units/:unitId` - Delete a company by id

- `GET /api/v1/companies/:companyId/assets` - Get all assets from a company
```jsonc
// Response body:
{
   "count": "number",
   "data": [
      {
         "id": "string",
         "name": "string",
         "description": "string",
         "model": "string",
         "owner": "string (owner ID)",
         "image": "string (image URL)",
         "health_level": "number",
         "status": "RUNNING | ALERTING | STOPPED",
         "unit": {
            "id": "string",
            "name": "string",
            "assetCount": "number"
         }
      },
   ]
}
