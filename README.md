# Swift-X application Server


## Installation

```bash
npm i
```

## Usage

```python
1. create a .env file in the root directory and add the following as an example:
MONGO_URL='mongodb://localhost:27017/swiftx'
PORT=4000
JWT_SECRET=haveFun

2. npm run dev -> to run the server
3. npm run test -> to run tests

```
## How to use

### Register
```python
1. endpoint = http://localhost:4000/register   "Or any port of your choice"
2. Provide the following example json in the body :
{
  "name": "user1",
  "password": "password",
  "email":"user1@gmail.com",
  "role":"regular"
}
role will be by default regular, But you can register as an Admin or Manager

It will return user token to be used in following requests
```

### Login
```python
1. endpoint = http://localhost:4000/login   "Or any port of your choice"
2. Provide the following example json in the body :
{
  "email": "user1@gmail.com",
   "password": "password"
}

```

### Create Joggings
```python
1. endpoint =  http://localhost:4000/jogging/   "Or any port of your choice"
2. you provide an Authorization token in the headres 

2. Provide the following example json in the body :
{
   "date": "2023-07-31",
  "distance": 16,
  "time": 4600
  }

It will return an object like this:
{
    "date": "2023-07-31T00:00:00.000Z",
    "distance": 16,
    "time": 4600,
    "createdBy": "64c65f3f948ac42285455841",
    "_id": "64c66085948ac42285455846",
    "__v": 0
}
```
### get Jogging
```python
1. endpoint =  http://localhost:4000/jogging/joggings/   "Or any port of your choice"
2. you provide an Authorization token in the headres 

It will return an object like this:

{
    "data": {
        "pagination": {
            "totalDocs": 1,
            "limit": 10,
            "totalPages": 1,
            "page": 1,
            "pagingCounter": 1,
            "hasPrevPage": false,
            "hasNextPage": false,
            "prevPage": null,
            "nextPage": null
        },
        "joggings": [
            {
                "_id": "64c66085948ac42285455846",
                "date": "2023-07-31T00:00:00.000Z",
                "distance": 16,
                "time": 4600,
                "createdBy": "64c65f3f948ac42285455841",
                "__v": 0
            }
        ]
    }
}
```
### get JoggingById
```python
1. endpoint =   http://localhost:4000/jogging/jogging/64c66085948ac42285455846/   "Or any port of your choice"
2. you provide an Authorization token in the headres 

It will return an object like this:

{
    "_id": "64c66085948ac42285455846",
    "date": "2023-07-31T00:00:00.000Z",
    "distance": 16,
    "time": 4600,
    "createdBy": {
        "_id": "64c65f3f948ac42285455841",
        "name": "user2",
        "email": "user2@gmail.com",
        "role": "regular",
        "createdAt": "2023-07-30T13:01:51.917Z",
        "updatedAt": "2023-07-30T13:01:51.917Z",
        "__v": 0
    },
    "__v": 0
}
```
### update Jogging
```python
1. endpoint =  http://localhost:4000/jogging/jogging/64c66085948ac42285455846/   "Or any port of your choice"
2. you provide an Authorization token in the headres 

3. Provide the following example json in the body :
{
   "date": "2023-07-31",
  "distance": 32,
  "time": 3200
  }

It will return an object like this:

{
    "_id": "64c66085948ac42285455846",
    "date": "2023-07-31T00:00:00.000Z",
    "distance": 32,
    "time": 3200,
    "createdBy": "64c65f3f948ac42285455841",
    "__v": 0
}
```
### delete Jogging
```python
1. endpoint =  http://localhost:4000/jogging/jogging/64c66085948ac42285455846/   "Or any port of your choice"
2. you provide an Authorization token in the headres 

It will return an object like this:

{
    "message": "Successfully deleted jogging of id 64c66085948ac42285455846"
}
```
### Filter Jogging From & to Dates
```python
1. endpoint =   http://localhost:4000/jogging/filter?from=2020-07-01&to=2023-07-31   "Or any port of your choice"
2. you provide an Authorization token in the headres 
3. you provide from & to as Query Params 
 
It will return an object like this:

{
    "data": {
        "pagination": {
            "totalDocs": 1,
            "limit": 10,
            "totalPages": 1,
            "page": 1,
            "pagingCounter": 1,
            "hasPrevPage": false,
            "hasNextPage": false,
            "prevPage": null,
            "nextPage": null
        },
        "joggings": [
            {
                "_id": "64c66432948ac42285455860",
                "date": "2023-07-31T00:00:00.000Z",
                "distance": 16,
                "time": 4600,
                "createdBy": "64c65f3f948ac42285455841",
                "__v": 0
            }
        ]
    }
}
```
### Weekly Report on average speed & distance per week.
```python
1. endpoint =    http://localhost:4000/jogging/weekly-report/   "Or any port of your choice"
2. you provide an Authorization token in the headres 
 
It will return an Array of objects like this:

[
    {
        "week": 31,
        "year": 2023,
        "startDate": "2023-07-29T22:00:00.000Z",
        "endDate": "2023-08-04T22:00:00.000Z",
        "distance": 16,
        "time": 4600,
        "count": 1,
        "averageSpeed": 0.0034782608695652175
    },
    {
        "week": 30,
        "year": 2023,
        "startDate": "2023-07-22T22:00:00.000Z",
        "endDate": "2023-07-28T22:00:00.000Z",
        "distance": 12,
        "time": 7800,
        "count": 2,
        "averageSpeed": 0.0015384615384615385
    }
]
```

### create User with an Admin or Manager.
```python
Register with an admin or Manager

1. endpoint =    http://localhost:4000/register/   "Or any port of your choice"
 
2. Provide the following example json in the body :
{
  "name": "admin",
  "password": "password",
  "email":"admin@gmail.com",
  "role":"admin"
}
3. Login With him :

a. endpoint = http://localhost:4000/login   "Or any port of your choice"
b. Provide the following example json in the body :
{
  "email": "admin@gmail.com",
   "password": "password"
}
c. it will return an object like this :
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzY2NmNlOTQ4YWM0MjI4NTQ1NTg3MiIsImlhdCI6MTY5MDcyNDA0OSwiZXhwIjoxNjkxMzI4ODQ5fQ.QYwkwKs7XizIPaHQ3byWuGz0LxkgcSXRez-wBjiEids",
    "email": "admin@gmail.com",
    "role": "admin"
}

4. endpoint =   http://localhost:4000/users/   "Or any port of your choice"
5. you provide an Authorization token in the headres 
6. Provide the following example json in the body :
{
  "name": "user3",
  "password": "password",
  "email":"user3@gmail.com",
  "role":"regular"
}
7. it will return an object like this :
{
    "name": "user3",
    "email": "user3@gmail.com",
    "role": "regular",
    "_id": "64c667b1948ac42285455877",
    "createdAt": "2023-07-30T13:37:53.031Z",
    "updatedAt": "2023-07-30T13:37:53.031Z",
    "__v": 0
}
```
### update User with an Admin or Manager.
```python
1. endpoint =   http://localhost:4000/users/64c667b1948ac42285455877/   "Or any port of your choice"
2. you provide an Authorization token in the headres 
3. Provide the following example json in the body :
{
  "name": "user4"
}
4. it will return an object like this :
{
    "_id": "64c667b1948ac42285455877",
    "name": "user4",
    "email": "user3@gmail.com",
    "role": "regular",
    "createdAt": "2023-07-30T13:37:53.031Z",
    "updatedAt": "2023-07-30T13:40:57.383Z",
    "__v": 0
}
```

### get all Users with an Admin or Manager.
```python
1. endpoint =    http://localhost:4000/users/   "Or any port of your choice"
2. you provide an Authorization token in the headres 

4. it will return an array of objects like this :
[
    {
        "_id": "64c52a649e5b0b1835125b56",
        "name": "moustafa",
        "email": "mostafa01@gmail.com",
        "role": "admin",
        "createdAt": "2023-07-29T15:04:04.576Z",
        "updatedAt": "2023-07-29T15:04:04.576Z",
        "__v": 0
    },
    {
        "_id": "64c643f8b12ae5b63dcb32a8",
        "name": "moustafa",
        "email": "mostafa02@gmail.com",
        "role": "regular",
        "createdAt": "2023-07-30T11:05:28.699Z",
        "updatedAt": "2023-07-30T11:05:28.699Z",
        "__v": 0
    },
    {
        "_id": "64c65155948ac4228545583d",
        "name": "user1",
        "email": "user1@gmail.com",
        "role": "regular",
        "createdAt": "2023-07-30T12:02:29.517Z",
        "updatedAt": "2023-07-30T12:02:29.517Z",
        "__v": 0
    },
    {
        "_id": "64c65f3f948ac42285455841",
        "name": "user2",
        "email": "user2@gmail.com",
        "role": "regular",
        "createdAt": "2023-07-30T13:01:51.917Z",
        "updatedAt": "2023-07-30T13:01:51.917Z",
        "__v": 0
    },
    {
        "_id": "64c666ce948ac42285455872",
        "name": "admin",
        "email": "admin@gmail.com",
        "role": "admin",
        "createdAt": "2023-07-30T13:34:06.179Z",
        "updatedAt": "2023-07-30T13:34:06.179Z",
        "__v": 0
    },
    {
        "_id": "64c667b1948ac42285455877",
        "name": "user4",
        "email": "user3@gmail.com",
        "role": "regular",
        "createdAt": "2023-07-30T13:37:53.031Z",
        "updatedAt": "2023-07-30T13:40:57.383Z",
        "__v": 0
    }
]
```
### get User By his ID with an Admin or Manager.
```python
1. endpoint =     http://localhost:4000/users/64c643f8b12ae5b63dcb32a8/   "Or any port of your choice"
2. you provide an Authorization token in the headres 

4. it will return an object like this :
{
    "_id": "64c643f8b12ae5b63dcb32a8",
    "name": "moustafa",
    "email": "mostafa02@gmail.com",
    "role": "regular",
    "createdAt": "2023-07-30T11:05:28.699Z",
    "updatedAt": "2023-07-30T11:05:28.699Z",
    "__v": 0
}
```

### delete User By his ID with an Admin or Manager.
```python
1. endpoint =     http://localhost:4000/users/64c643f8b12ae5b63dcb32a8/   "Or any port of your choice"
2. you provide an Authorization token in the headres 

4. it will return an object like this :
{
    "message": "Successfully deleted user of id 64c643f8b12ae5b63dcb32a8"
}
```