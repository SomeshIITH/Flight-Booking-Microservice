### BookingService

- change package name and then do `npm install`   --> boiler plate ready

- `npx sequelize init` , then do changes in config.json then do  `npx sequelize db:create` to create db

- setup db by `npx sequelize model:generate --name Booking --attributes flightId:integer,userId:integer,status:enum,noOfSeats:integer,totalCost:integer` and then execute `npx sequelize db:migrate`

- `npx sequelize migration:create --name modify_bookings_add_new_fields` do change in model and migrate then `npx sequelize db:migrate` and then sync db`

- added messageQueue logic and environment variables 

- amqp://localhost is a connection string (URI) used by a client application to connect to a message broker running on the same computer ("localhost") using the Advanced Message Queuing Protocol (AMQP). 

- ISSUE : currently it is creating channel everytime so once rectify it

- rabbitmq is running in `http://localhost:15672/` 

- npx sequelize model:generate --name Booking --attributes flightId:integer,userId:integer,status:enum,noOfSeats:integer,totalCost:integer

- Asynchronous Consistency.

- Phase 1: User clicks "Book" ➡️ Status is INPROCESS.

- Phase 2: User is redirected to Payment Gateway ➡️ Status becomes PENDING.

- Phase 3: Payment Success Webhook arrives ➡️ Update transactionId and set status to BOOKED.
