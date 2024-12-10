# event-tbd
Hyper local social media network that connects people through common interests.

# Running the Server

To start the server, run npm run start


# To access the database API

- For user database, go to http://localhost:3000/api/user/getAll
- For event database, go to http://localhost:3000/api/event/getAll

# To use mock data
```
node seed.js
```
# To start the server 

- Make sure the there is no database.sqlite 
- First start the server to set up the database 
```
npm run start 
```
- close the server then on the event-tbd directory 
```
node seed.js 
```
- then run the server again
```
npm run start 
```