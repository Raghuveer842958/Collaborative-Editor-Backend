const axios = require("axios");

exports.executeCode = async (langId, code) => {
  console.log("langId code is :", langId, code);
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: {
      base64_encoded: "false",
      wait: "true", // this makes it return the result in one go
    },
    headers: {
      "content-type": "application/json",
      "x-rapidapi-key": "ab114ce02emsh4395e73f2b252bep19e36ajsnd6c696ddbfff", // replace with your key
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
    data: {
      language_id: langId, // 63 is for JavaScript (Node.js)
      source_code: code,
      stdin: "",
    },
  };

  try {
    const response = await axios.request(options);
    console.log("Output:", response.data.stdout);
    return ({
      message: "result successfully fetched",
      output: response.data.stdout,
      success: true,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return ({
      message: "",
      success: false,
    });
  }
};
