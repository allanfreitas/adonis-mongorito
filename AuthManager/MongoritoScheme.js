'use strict'

const BaseScheme = require('adonis-auth/src/Schemes/BaseScheme')
const NE = require('node-exceptions')

class MongoritoScheme extends BaseScheme {

  /**
   * returns key to be used for saving session value.
   * @return {String}
   *
   * @public
   */
  get sessionKey () {
    return 'mongodb-auth'
  }

  /**
   * tries to resolve the user for the current request or
   * returns null
   *
   * @return {Object}
   *
   * @private
   */
  * _getRequestUser () {
    const userSession = yield this.request.session.get(this.sessionKey)
    if (!userSession) {
      return null
    }
    return yield this.serializer.findById(userSession, this.options)
  }

  /**
   * login a user using the user object, it blindly trusts the
   * input.
   *
   * @param  {Object} user
   * @return {Boolean}
   *
   * @throws InvalidArgumentException when primary key value does not exists
   *                                  on the input
   *
   * @public
   */
  * login (user) {
    const primaryKey = this.serializer.primaryKey(this.options)
    const primaryValue = user.attributes[primaryKey]
    if (!primaryValue) {
      throw new NE.InvalidArgumentException(`Value for ${primaryKey} is null for given user.`)
    }
    yield this.request.session.put(this.sessionKey, primaryValue)
    this.user = user
    return true
  }

  /**
   * logout a user by removing session and setting
   * local instance to null
   *
   * @return {Boolean}
   *
   * @public
   */
  * logout () {
    yield this.request.session.forget(this.sessionKey)
    this.user = null
    return true
  }

  /**
   * login a user using the userId, it does verify the user
   * using the serializer.
   *
   * @param  {Number} userId
   * @return {Boolean}
   *
   * @public
   */
  * loginViaId (userId) {
    const user = yield this.serializer.findById(userId, this.options)
    if (!user) {
      return false
    }
    return yield this.login(user)
  }

  /**
   * validates user credentials using validate method and login a
   * user if validate succeeds.
   *
   * @param  {String} uid
   * @param  {String} password
   * @return {Boolean}
   *
   * @see validate
   * @see login
   *
   * @public
   */
  * attempt (uid, password) {
    const user = yield this.validate(uid, password, true)
    return yield this.login(user)
  }

}

module.exports = MongoritoScheme