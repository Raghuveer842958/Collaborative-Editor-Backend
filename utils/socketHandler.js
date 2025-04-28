// sockets/socketHandler.js
const { executeCode } = require("../controllers/executeCodeController");

const { supportedLanguage } = require("./supportedLanguage");
const rooms = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName, langId) => {
      console.log(
        "roomId userId userName is :",
        roomId,
        userId,
        userName,
        langId
      );

      const userData = {
        id: userId,
        name: userName,
        isOwner: false,
        isAllowed: false,
      };

      socket.join(roomId);

      if (!rooms[roomId]) {
        const filteredData = supportedLanguage.filter((lang) => {
          if (lang.id === langId) {
            console.log("Default code is :", lang.defaultCode);
            return lang;
          }
        });

        console.log("default code is :", filteredData);
        userData.isOwner = true;
        userData.isAllowed = true;
        rooms[roomId] = { code: filteredData[0]?.defaultCode, users: [] };
      }

      const userExists = rooms[roomId].users.some((user) => user.id === userId);
      if (!userExists) {
        rooms[roomId].users.push(userData);
      }

      socket.emit("load-code", rooms[roomId].code);
      io.to(roomId).emit("user-list", rooms[roomId].users);

      console.log("User list is :", rooms[roomId].users);

      console.log(`${userName} joined room: ${roomId}`);
    });

    socket.on("code-change", ({ roomId, code }) => {
      if (!rooms[roomId]) {
        console.log(`Room ${roomId} does not exist!`);
        return;
      }
      rooms[roomId].code = code;
      socket.to(roomId).emit("code-update", code);
    });

    socket.on("change-language", (roomId, langId) => {
      const language = supportedLanguage.find((lang) => lang.id === langId);

      if (language) {
        if (!rooms[roomId]) {
          rooms[roomId] = { code: language.defaultCode, users: [] };
        } else {
          rooms[roomId].code = language.defaultCode;
        }
        io.to(roomId).emit("code-update", language.defaultCode);
      }
    });

    socket.on("execute-code", async (roomId, langId, code) => {
      const response = await executeCode(langId, code);
      console.log("Response is :", response);
      io.to(roomId).emit("show-output", response);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      for (const roomId in rooms) {
        rooms[roomId].users = rooms[roomId].users.filter(
          (user) => user.id !== socket.id
        );

        if (rooms[roomId].users.length === 0) {
          delete rooms[roomId];
        } else {
          io.to(roomId).emit("user-list", rooms[roomId].users);
        }
      }
    });
  });
};

module.exports = socketHandler;


// const details = {
//     host: "",
//     port: 1234,
//     password: "s4euuVYtWtaR9A6CsVon7X9BUBTV8NLe"
// }
