// sockets/socketHandler.js

const { executeCode } = require("../controllers/executeCodeController");

const { supportedLanguage } = require("./supportedLanguage");
const redisClient = require("../redis"); // <<< imported Redis client

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connected:", socket.id);

    socket.on("join-room", async (roomId, userId, userName, langId) => {
      console.log("roomId, userId, userName, langId:", roomId, userId, userName, langId);

      const userData = {
        id: userId,
        name: userName,
        isOwner: false,
        isAllowed: false,
      };

      socket.join(roomId);

      let roomData = await redisClient.get(roomId);
      roomData = roomData ? JSON.parse(roomData) : null;

      if (!roomData) {
        const filteredData = supportedLanguage.find((lang) => lang.id === langId);

        console.log("Default code is:", filteredData?.defaultCode);

        userData.isOwner = true;
        userData.isAllowed = true;

        roomData = { code: filteredData?.defaultCode || "", users: [] };
      }

      const userExists = roomData.users.some((user) => user.id === userId);

      if (!userExists) {
        roomData.users.push(userData);
      }

      await redisClient.set(roomId, JSON.stringify(roomData));

      socket.emit("load-code", roomData.code);
      io.to(roomId).emit("user-list", roomData.users);

      console.log("User list:", roomData.users);
      console.log(`${userName} joined room: ${roomId}`);
    });

    socket.on("code-change", async ({ roomId, code }) => {
      let roomData = await redisClient.get(roomId);
      roomData = roomData ? JSON.parse(roomData) : null;

      if (!roomData) {
        console.log(`Room ${roomId} does not exist!`);
        return;
      }

      roomData.code = code;

      await redisClient.set(roomId, JSON.stringify(roomData));

      socket.to(roomId).emit("code-update", code);
    });

    socket.on("change-language", async (roomId, langId) => {
      const language = supportedLanguage.find((lang) => lang.id === langId);

      if (language) {
        let roomData = await redisClient.get(roomId);
        roomData = roomData ? JSON.parse(roomData) : { users: [] };

        roomData.code = language.defaultCode;

        await redisClient.set(roomId, JSON.stringify(roomData));

        io.to(roomId).emit("code-update", language.defaultCode);
      }
    });

    socket.on("execute-code", async (roomId, langId, code) => {
      const response = await executeCode(langId, code);
      console.log("Response is:", response);
      io.to(roomId).emit("show-output", response);
    });

    socket.on("disconnect", async () => {
      console.log("A user disconnected:", socket.id);

      const keys = await redisClient.keys("*");

      for (const roomId of keys) {
        let roomData = await redisClient.get(roomId);
        roomData = roomData ? JSON.parse(roomData) : null;

        if (roomData) {
          // Carefully remove user by their userId, not necessarily socket.id
          roomData.users = roomData.users.filter((user) => user.id !== socket.id);

          if (roomData.users.length === 0) {
            await redisClient.del(roomId);
            console.log(`Deleted empty room: ${roomId}`);
          } else {
            await redisClient.set(roomId, JSON.stringify(roomData));
            io.to(roomId).emit("user-list", roomData.users);
          }
        }
      }
    });
  });
};

module.exports = socketHandler;
