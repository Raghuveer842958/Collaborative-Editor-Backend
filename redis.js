// const { createClient } = require("@redis/client");

// const client = createClient({
//   url: "redis://default:s4euuVYtWtaR9A6CsVon7X9BUBTV8NLe@redis-10947.c305.ap-south-1-1.ec2.redns.redis-cloud.com:10947",
// });

// client.on("connect", () => {
//   console.log("Connected to Redis successfully!");
// });

// client.on("error", (err) => {
//   console.error("Redis connection error:", err);
// });

// client
//   .connect()
//   .then(() => {
//     console.log("Redis connection established.");
//   })
//   .catch((err) => {
//     console.error("Error connecting to Redis:", err);
//   });




// const { createClient } = require("@redis/client");

// console.log("file is running.............");

// const client = createClient({
//   url: "redis://default:s4euuVYtWtaR9A6CsVon7X9BUBTV8NLe@redis-10947.c305.ap-south-1-1.ec2.redns.redis-cloud.com:10947",
// });

// // Handling the connection events
// client.on("connect", () => {
//   console.log("Connected to Redis successfully!");
// });

// client.on("error", (err) => {
//   console.error("Redis connection error:", err);
// });

// // Connect to the Redis server
// client.connect().then(() => {
//   // Set a key-value pair
//   client
//     .set("testKey", "Hello, Redis!")
//     .then(() => {
//       // Get the value for the key
//       client
//         .get("testKey")
//         .then((reply) => {
//           console.log("The value of 'testKey' is:", reply); // Should print "Hello, Redis!"
//           client.quit(); // Close the Redis connection
//         })
//         .catch((err) => {
//           console.error("Error getting value:", err);
//         });
//     })
//     .catch((err) => {
//       console.error("Error setting value:", err);
//     });
// });


// config/redisClient.js

const { createClient } = require("@redis/client");

const client = createClient({
  url: "redis://default:s4euuVYtWtaR9A6CsVon7X9BUBTV8NLe@redis-10947.c305.ap-south-1-1.ec2.redns.redis-cloud.com:10947",
});

client.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

client
  .connect()
  .then(() => {
    console.log("Redis connection established.");
  })
  .catch((err) => {
    console.error("Error connecting to Redis:", err);
  });

module.exports = client; // <<< Exported properly
