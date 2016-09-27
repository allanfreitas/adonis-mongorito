'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider
const Mongorito = require('mongorito')
const CatLog = require('cat-log')
const logger = new CatLog('adonis:mongorito')

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
    this.app.singleton('Adonis/Addons/MongoritoModel', function (app) {
      const Config = app.use('Adonis/Src/Config')
      const mongoHost = Config.get('mongo.host')
      const mongoPort = Config.get('mongo.port')
      const mongoDb = Config.get('mongo.db')
      const mongoUser = Config.get('mongo.user', '')
      const mongoPass = Config.get('mongo.pass', '')

      const connectUri = `${mongoHost}:${mongoPort}/${mongoDb}`
      const connectionString = (mongoUser !== '' || mongoPass !== '') ? `${mongoUser}:${mongoPass}@${connectUri}` : connectUri

      logger.verbose('connection string %s', connectionString)
      Mongorito.connect(connectionString)

      return MongoritoModel
    })
  }
}

module.exports = MongoritoProvider
