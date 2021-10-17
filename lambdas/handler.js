const preSignUp = require('./src/preSignUp')
const postSignIn = require('./src/postSignIn')
const postConfirmation = require('./src/postConfirmation')
const preSignIn = require('./src/preSignIn')
const preToken = require('./src/preToken')
const customMessage = require('./src/customMessage')
const createUser = require('./src/createUser')


module.exports = {
  preSignUp,

  postSignIn,

  preSignIn,

  preToken,

  postConfirmation,

  customMessage,

  createUser
}
