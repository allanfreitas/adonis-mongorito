'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

const Mongorito = require('mongorito')

class MongoritoProvider extends ServiceProvider {

  * register () {
    this.app.singleton('Adonis/Addons/MongoritoModel', function (app) {

      const config = app.use('Adonis/Src/Config')
      const mongo_host = config.get('mongo.host')
      const mongo_port = config.get('mongo.port')
      const mongo_db   = config.get('mongo.db')
      const mongo_user = config.get('mongo.user', '')
      const mongo_pass = config.get('mongo.pass', '')

      const connect_uri = mongo_host+':'+mongo_port+'/'+mongo_db;
      const hasAuthDetails = (mongo_user != '' || mongo_pass != '')
      console.log('hasAuthDetails:',hasAuthDetails)
      if (hasAuthDetails)
      {
        console.log(mongo_user+':'+mongo_pass+'@'+connect_uri)
        Mongorito.connect(mongo_user+':'+mongo_pass+'@'+connect_uri)
      }else{
        Mongorito.connect(connect_uri)
      }

      return Mongorito.Model
    })
  }

}

module.exports = MongoritoProvider
