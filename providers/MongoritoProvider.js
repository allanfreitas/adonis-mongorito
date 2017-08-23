'use strict'

const Ioc = require('adonis-fold').Ioc
const ServiceProvider = require('adonis-fold').ServiceProvider
const Mongorito = require('mongorito')
const CatLog = require('cat-log')
const logger = new CatLog('adonis:mongorito')
const MongoritoScheme = require('../AuthManager/MongoritoScheme')
const MongoritoSerializer = require('../Serializer/MongoritoSerializer')

class MongoritoModel extends Mongorito.Model {

  /**
   * Required to instructor IoC container to never make an
   * instance of this class even when `make` is called.
   * Model instances should be controlled by user.
   *
   * @return {Boolean}
   */
  static get makePlain () {
    return true
  }

}

class MongoritoProvider extends ServiceProvider {

  * register () {
    const managers = this.app.getManagers()

    // Add Mongo auth support
    managers['Adonis/Src/AuthManager'].extend('MongoritoScheme', MongoritoScheme, 'scheme')
    // Add Mongo serializer
    Ioc.extend('Adonis/Src/AuthManager', 'MongoritoSerializer', function (app) {
      return new MongoritoSerializer()
    }, 'serializer')

    this.app.singleton('Adonis/Addons/MongoritoModel', function (app) {
      const Config = app.use('Adonis/Src/Config')
      const mongoHost = Config.get('mongo.host')
      const mongoPort = Config.get('mongo.port')
      const mongoDb = Config.get('mongo.db')
      const mongoUser = Config.get('mongo.user', '')
      const mongoPass = Config.get('mongo.pass', '')
      const mongoOptions = Config.get('mongo.options', '')

      var connectUri = `${mongoHost}:${mongoPort}/${mongoDb}`
      if (mongoOptions !== '') {
        connectUri += '?' + mongoOptions
      }
      const connectionString = (mongoUser !== '' || mongoPass !== '') ? `${mongoUser}:${mongoPass}@${connectUri}` : connectUri

      logger.verbose('connection string %s', connectionString)
      Mongorito.connect(connectionString)

      return MongoritoModel
    })
  }
}

module.exports = MongoritoProvider
