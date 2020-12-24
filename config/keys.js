// module.exports = {
//   mongoURI:
//     "mongodb+srv://chrisjose:Aston1490@cluster0.ugvp7.mongodb.net/<dbname>?retryWrites=true&w=majority",
//   secretOrKey: 'secret'
// };

if (process.env.NODE_ENV === "production") {
  module.exports = require("./keys_prod");
} else {
  module.exports = require("./keys_dev");
}