# NTNU PROG2053 Part 3 Solution

The project is taken from the Stanford course, CS142, with the permission of the course leader
Mendel Rosenblum.

## How to run this solution

You need 3 console windows (considering all of them are at the current project folder)

### Console 1 (Mongo service)

- mkdir database
- mongod --dbpath ./database
- (Keep open)

### Console 2 (Load database data & Express)

- npm i
- npm run load-db
- npm run start-express
- (Keep open)

### Console 3 (React)

- npm start
- (Keep open)