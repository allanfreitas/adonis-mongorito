# adonis-mongorito
AdonisJS Addon Provider for Mongorito (mongodb package for nodejs)


## Installation

```js
$ npm install adonis-mongorito --save
```
The command above will install the package mongorito too.

You need to create a `config/mongo.js` file with the contents:

```js
'use strict'

const Env = use('Env')

module.exports = {
  host: Env.get('MONGO_HOST', 'localhost'),
  port: Env.get('MONGO_PORT', '27017'),
  user: Env.get('MONGO_USER', ''),
  pass: Env.get('MONGO_PASS', ''),
  db: Env.get('MONGO_DATABASE', 'adonisjs')
}
```
*You are using a connection local without user and pass, leave it blank like on the example.*

Add the entry `adonis-mongorito/providers/MongoritoProvider.js` to the providers array on `bootstrap/app.js` like this:

```js
const providers = [
  'adonis-framework/providers/ConfigProvider',
  'adonis-framework/providers/EnvProvider',
   //..OTHER DEFAULT PROVIDERS...//
  'adonis-middleware/providers/AppMiddlewareProvider',
  'adonis-auth/providers/AuthManagerProvider',
  'adonis-mongorito/providers/MongoritoProvider' //add this line after install the package
]
```

Add the entry `MongoritoModel: 'Adonis/Addons/MongoritoModel'` on the `aliases` object on `bootstrap/app.js` file like this:

```js
const aliases = {
  Command: 'Adonis/Src/Command',
  Config: 'Adonis/Src/Config',
   //..OTHER DEFAULT PROVIDERS...//
  View: 'Adonis/Src/View',
  MongoritoModel: 'Adonis/Addons/MongoritoModel' //this line
}
```

## Usage

*Now you can create Mongo MODELS like Lucid Models*

**app/Model/Post.js**

```js
'use strict'

const MongoritoModel = use('MongoritoModel')

class Post extends MongoritoModel {

}

module.exports = Post
```

*And use like this:* 

**app/Http/routes.js**

```js
'use strict'

const Route = use('Route')

const Post = use('App/Model/Post')

Route.get('/posts', function * (request, response) {
  //Simple get All Posts
  const posts = yield Post.all()

  response.json(posts)
})

Route.post('/posts', function * (request, response) {

  //create new Post
  let post = new Post({
    title: request.input('title'),
    author: {
      name: request.input('author_name')
    }
  });

  yield post.save();

  response.json(post)
})
```

**As you can see, it's very easy to use.**
****

## How to use Mongorito stuff?
- Mongorito Official site/docs: https://mongorito.com
- Mongorito Repository: https://github.com/vdemedes/mongorito

## Found any Bugs?
Please before open a Issue on this repository, 
check if it's not a bug on Mongorito package here: **https://github.com/vdemedes/mongorito/issues**


## License

Adonis-Mongorito is released under the MIT License.

