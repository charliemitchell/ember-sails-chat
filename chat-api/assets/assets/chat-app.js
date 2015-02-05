define("chat-app/app", 
  ["ember","ember/resolver","ember/load-initializers","chat-app/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var loadInitializers = __dependency3__["default"];
    var config = __dependency4__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("chat-app/controllers/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global io */
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend(Ember.Evented, {

      usernameIsSet: false,
      filterQuery: "",
      chat: "",
      chats: [],
      filteredChat: [],
      userlist: [],
      socket: null,
      useTranscript: "chats",

      transcript: (function () {
        return this.get(this.get("useTranscript"));
      }).property("useTranscript", "filteredChat"),

      filterTranscript: (function () {
        Ember.run.debounce(this, function () {
          var term = this.get("filterQuery"),
              query = new RegExp("(" + term + ")", "ig"),
              chats = this.get("chats"),
              filtered = Ember.A();

          if (!term) {
            this.set("useTranscript", "chats");
          } else {
            chats.forEach(function (chat) {
              if (chat.message.match(query)) {
                filtered.push(chat);
              }
            });

            this.set("filteredChat", filtered);

            if (this.get("useTranscript") !== "filteredChat") {
              this.set("useTranscript", "filteredChat");
            }
          }
        }, 500);
      }).observes("filterQuery"),

      io_connect: function (username) {
        var socket = io.connect(document.URL);
        this.set("socket", socket);
        socket.emit("identify", username);

        socket.on("newconnection", (function (data) {
          this.get("userlist").push(data);
        }).bind(this));

        socket.on("chat", (function (data) {
          this.get("chats").pushObject(data);
          this.trigger("scrollTranscript");
        }).bind(this));

        socket.on("userlist", (function (data) {
          this.set("userlist", data);
        }).bind(this));
      },

      actions: {

        sendChat: function () {
          // Push the message into the transcript
          this.get("chats").pushObject({
            message: this.get("chat"),
            nickname: "You",
            time: new Date().getTime(),
            self: true
          });

          // Push the message to the server
          this.get("socket").emit("chat", {
            message: this.get("chat"),
            time: new Date().getTime() // Doing the time client side
          });

          // Clear the input
          this.set("chat", "");

          this.trigger("scrollTranscript");
        },

        setusername: function () {
          var username = this.get("username");

          if (username) {
            this.io_connect(username); // Connect to the web socket service
            this.set("usernameIsSet", true); // Show the chat room
          } else {
            this.trigger("no_username"); // username is required :: make things red
          }
        },

        clearFilterQuery: function () {
          this.set("filterQuery", ""); // Clear the input
          this.set("useTranscript", "chats"); // choose the chats array as the transcript
        }
      }
    });
  });
define("chat-app/helpers/format-date", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    /* format-date
    *@param input > type: non-scalar (must be able to be parsed by moment.js)
    */
    function formatDate(input) {
      return new moment(input).format("llll");
    }

    __exports__.formatDate = formatDate;
    __exports__["default"] = Ember.Handlebars.makeBoundHelper(formatDate);
  });
define("chat-app/initializers/export-application-global", 
  ["ember","chat-app/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;

    __exports__["default"] = {
      name: "export-application-global",

      initialize: initialize
    };
  });
define("chat-app/router", 
  ["ember","chat-app/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var Router = Ember.Router.extend({
      location: config.locationType
    });

    Router.map(function () {});

    __exports__["default"] = Router;
  });
define("chat-app/routes/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return {
          username: ""
        };
      }
    });
  });
define("chat-app/templates/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n    <div class=\"jumbotron\">\n      <div class=\"well\">\n        <h1>Chat-App</h1>\n        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vitae dapibus odio, lacinia dignissim arcu.</p>\n        <p>\n          <div class=\"row\">\n            <div class=\"col-sm-12\">\n              <h4>Choose Your Screen Name To Get Started!</h4>\n\n              <form class=\"form-horizontal\">\n                <fieldset>\n                  <div class=\"form-group\" id=\"screenNameGroup\">\n                    <label for=\"screenName\" class=\"col-lg-2 control-label\">Screen Name</label>\n                    <div class=\"col-lg-10\">\n                      ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("username"),
        'class': ("form-control"),
        'id': ("screenName"),
        'placeholder': ("Screen Name")
      },hashTypes:{'value': "ID",'class': "STRING",'id': "STRING",'placeholder': "STRING"},hashContexts:{'value': depth0,'class': depth0,'id': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n                    </div>\n                  </div>\n\n                  <div class=\"form-group\">\n                    <div class=\"col-lg-10 col-lg-offset-2\">\n                      <button type=\"submit\" class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "setusername", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Chat</button>\n                    </div>\n                  </div>\n                  \n                </fieldset>\n              </form>\n            </div>\n          </div>\n        </p>\n      </div>\n    </div>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <div class=\"col-sm-12 well\">\n      <h4>People in here</h4>\n      ");
      stack1 = helpers._triageMustache.call(depth0, "userlist", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n\n    <hr/>\n    <section id=\"chat\">\n      <ul class=\"chat-thread\">\n          ");
      stack1 = helpers.each.call(depth0, "transcript", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </ul>\n\n      <form class=\"chat-window\">\n        <div class=\"row\">\n          <div class=\"col-sm-12 col-md-10\">\n            ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'class': ("chat-window-message"),
        'autocomplete': ("off"),
        'autofocus': ("true"),
        'placeholder': ("Type your message"),
        'value': ("chat")
      },hashTypes:{'class': "STRING",'autocomplete': "STRING",'autofocus': "STRING",'placeholder': "STRING",'value': "ID"},hashContexts:{'class': depth0,'autocomplete': depth0,'autofocus': depth0,'placeholder': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n          </div>\n          <br class=\"visible-sm-*\"/>\n          <div class=\"col-sm-12 col-md-2 text-left\">\n            <button class=\"btn btn-success\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "sendChat", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Send</button>\n          </div>\n          </div>\n      </form>\n      </section>\n");
      return buffer;
      }
    function program4(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n            <li ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("self:mine:theirs")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n              <div class=\"sender\">");
      stack1 = helpers._triageMustache.call(depth0, "nickname", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</div>\n              <div class=\"chat-date\">");
      data.buffer.push(escapeExpression((helper = helpers['format-date'] || (depth0 && depth0['format-date']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "time", options) : helperMissing.call(depth0, "format-date", "time", options))));
      data.buffer.push("</div>\n              ");
      stack1 = helpers._triageMustache.call(depth0, "message", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            </li>\n          ");
      return buffer;
      }

      data.buffer.push("<div class=\"navbar navbar-inverse\">\n  <div class=\"navbar-header\">\n    <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-inverse-collapse\">\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n      <span class=\"icon-bar\"></span>\n    </button>\n    <a class=\"navbar-brand\" href=\"#\">Prototype</a>\n  </div>\n  <div class=\"navbar-collapse collapse navbar-inverse-collapse\">\n    <ul class=\"nav navbar-nav\">\n      <li class=\"active\"><a href=\"#\">Chat App</a></li>\n      <li><a href=\"http://github.com/charliemitchell/\">My Github</a></li>\n    </ul>\n    \n    \n\n    <ul class=\"nav navbar-nav navbar-right\">\n      <li>\n        <form class=\"navbar-form navbar-left\">\n          ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'value': ("filterQuery"),
        'class': ("form-control"),
        'placeholder': ("Live Filter Transcript")
      },hashTypes:{'value': "ID",'class': "STRING",'placeholder': "STRING"},hashContexts:{'value': depth0,'class': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n        </form>\n      </li>\n      <li class=\"hasAction\">\n        <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "clearFilterQuery", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Clear</a>\n      </li>\n    </ul>\n  </div>\n</div>\n\n");
      stack1 = helpers.unless.call(depth0, "usernameIsSet", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      stack1 = helpers['if'].call(depth0, "usernameIsSet", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      
    });
  });
define("chat-app/tests/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('app.js should pass jshint', function() { 
      ok(true, 'app.js should pass jshint.'); 
    });
  });
define("chat-app/tests/chat-app/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - chat-app/tests/helpers');
    test('chat-app/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'chat-app/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("chat-app/tests/chat-app/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - chat-app/tests/helpers');
    test('chat-app/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'chat-app/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("chat-app/tests/chat-app/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - chat-app/tests');
    test('chat-app/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'chat-app/tests/test-helper.js should pass jshint.'); 
    });
  });
define("chat-app/tests/chat-app/tests/unit/controllers/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - chat-app/tests/unit/controllers');
    test('chat-app/tests/unit/controllers/application-test.js should pass jshint', function() { 
      ok(true, 'chat-app/tests/unit/controllers/application-test.js should pass jshint.'); 
    });
  });
define("chat-app/tests/chat-app/tests/unit/helpers/format-date-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - chat-app/tests/unit/helpers');
    test('chat-app/tests/unit/helpers/format-date-test.js should pass jshint', function() { 
      ok(true, 'chat-app/tests/unit/helpers/format-date-test.js should pass jshint.'); 
    });
  });
define("chat-app/tests/chat-app/tests/unit/routes/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - chat-app/tests/unit/routes');
    test('chat-app/tests/unit/routes/application-test.js should pass jshint', function() { 
      ok(true, 'chat-app/tests/unit/routes/application-test.js should pass jshint.'); 
    });
  });
define("chat-app/tests/chat-app/tests/unit/views/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - chat-app/tests/unit/views');
    test('chat-app/tests/unit/views/application-test.js should pass jshint', function() { 
      ok(true, 'chat-app/tests/unit/views/application-test.js should pass jshint.'); 
    });
  });
define("chat-app/tests/controllers/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/application.js should pass jshint', function() { 
      ok(true, 'controllers/application.js should pass jshint.'); 
    });
  });
define("chat-app/tests/helpers/format-date.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - helpers');
    test('helpers/format-date.js should pass jshint', function() { 
      ok(true, 'helpers/format-date.js should pass jshint.'); 
    });
  });
define("chat-app/tests/helpers/resolver", 
  ["ember/resolver","chat-app/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("chat-app/tests/helpers/start-app", 
  ["ember","chat-app/app","chat-app/router","chat-app/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var application;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Ember.run(function () {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();
      });

      return application;
    }
  });
define("chat-app/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(true, 'router.js should pass jshint.'); 
    });
  });
define("chat-app/tests/routes/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/application.js should pass jshint', function() { 
      ok(true, 'routes/application.js should pass jshint.'); 
    });
  });
define("chat-app/tests/test-helper", 
  ["chat-app/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

    QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
    var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
    document.getElementById("ember-testing-container").style.visibility = containerVisibility;
  });
define("chat-app/tests/unit/controllers/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:application", "ApplicationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("chat-app/tests/unit/helpers/format-date-test", 
  ["chat-app/helpers/format-date"],
  function(__dependency1__) {
    "use strict";
    var formatDate = __dependency1__.formatDate;

    module("FormatDateHelper");

    // Replace this with your real tests.
    test("it works", function () {
      var result = formatDate(42);
      ok(result);
    });
  });
define("chat-app/tests/unit/routes/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:application", "ApplicationRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("chat-app/tests/unit/views/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("view:application", "ApplicationView");

    // Replace this with your real tests.
    test("it exists", function () {
      var view = this.subject();
      ok(view);
    });
  });
define("chat-app/tests/views/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/application.js should pass jshint', function() { 
      ok(true, 'views/application.js should pass jshint.'); 
    });
  });
define("chat-app/views/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend({
      didInsertElement: function () {
        this.get("controller").on("no_username", this, this.usernameError).on("scrollTranscript", this, this.scrollTranscript);
      },
      usernameError: function () {
        this.$("#screenNameGroup").addClass("has-error");
      },

      chatThread: false, // cache the DOM lookup

      scrollTranscript: function () {
        Ember.run.next(this, function () {
          if (this.get("chatThread")) {
            // if the node is cached
            this.get("chatThread").scrollTop(900000); // Scroll it (quicker than measuring)
          } else {
            this.set("chatThread", this.$(".chat-thread")); // Cache it
            this.get("chatThread").scrollTop(900000); // Scroll it
          }
        });
      }
    });
  });
/* jshint ignore:start */

define('chat-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'chat-app';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("chat-app/tests/test-helper");
} else {
  require("chat-app/app")["default"].create({});
}

/* jshint ignore:end */
//# sourceMappingURL=chat-app.map