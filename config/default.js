module.exports = {

  "db": {
    "host": "10.2.8.235"
    , "port": 27017
    , "dbname": "starwall"
    , "pool": 5
  },

  "testdb": {
    "host": "127.0.0.1"
    , "port": 27017
    , "dbname": "developer"
    , "pool": 5
  },

  "mail": {
    "service": "Gmail"
    , "auth": {
      "user": "smart@gmail.com"
      , "pass": "smart"
    }
  },

  "app": {
    "port": 3000
    , "views": "views"
    , "cookieSecret": "smartcore"
    , "sessionSecret": "smartcore"
    , "sessionKey": "smartcore.sid"
    , "sessionTimeout": 720 // 24 * 30 一个月
    , "tmp": "/tmp"
    , "hmackey": "smartcore"
    , "i18n": {
          "cache": "memory"
        , "lang": "zh"
        , "category": "starwall"
      }
    , "ignoreAuth": [
        "^\/stylesheets"
      , "^\/javascripts"
      , "^\/vendor"
      , "^\/images"
      , "^\/video"
      , "^\/$"
      , "^\/simplelogin.*"
      , "^\/simplelogout.*"
      , "^\/login.*"
      , "^\/register.*"
      , "^\/archive"
      , "^\/download.*"
    ]
  }

  , "log": {
    "fluent": {
      "enable": "false"
      , "tag": "node"
      , "host": "10.2.8.228"
      , "port": 24224
      , "timeout": 3.0
    }
  },

  "mq": {
    "host": "mq"
    , "port": 5672
    , "user": "guest"
    , "password": "guest"
    , "queue_join": "smartJoin"
    , "queue_apn": "smartApn"
    , "queue_thumb": "smartThumb"
    , "maxListeners": 0
  },

  "websocket": {
    "center_server": {
      "primary": "http://localhost:3000"
      ,"secondary": ""
    }
    , "log_level": 1
  }
}
