if (typeof String.prototype.contains != 'function') {
  String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
}

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length).toLowerCase() == str.toLowerCase();
  };
}

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length).toLowerCase() == str.toLowerCase();
  };
}

if (typeof Array.prototype.remove != 'function') {
  Array.prototype.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
          what = a[--L];
          while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1);
          }
      }
      return this;
  };
}

function Webapp() {
  var self = this;
  this.router = null;

  window.socket = io.connect('');
  this.pageview = new PageView({});
  this.frontpageview = new FrontpageView({});
  this.playlistview = new PlaylistView({model: new DummyModel()});
  this.searchView = new SearchView({model: new DummyModel()});
  this.wishlistView = new WishlistView({model: new DummyModel()});
  this.adminView = new AdminView({model: new DummyModel()});
  this.photoView = new PhotoView({model: new DummyModel()});

  this.scrollPositions = {};
  this.currentview = null;

  $(window).scroll(function (e) {
    if (self.currentview) {
      if ($(window).scrollTop() !== 0) {
        self.scrollPositions[self.currentview.cid] = $(window).scrollTop();
      }
    }
  });



  this.initRouter();

}

Webapp.prototype.switchMainView = function(newview) {
  if (this.currentview) {
    $(this.currentview.el).detach();
  }

  $("#content").html(newview.el);
  if (this.scrollPositions[newview.cid]) {
    $(document).scrollTop(this.scrollPositions[newview.cid]);
  }

  this.currentview = newview;

}

Webapp.prototype.initRouter = function() {
  var self = this;


  var Router = Backbone.Router.extend({

    routes: {
      "playlist": "playlist",
      "search": "search",
      "wishlist": "wishlist",
      "admin": "admin",
      "photo": "photo",
      '*d': 'defaultRoute'
    },

    playlist: function() {
      self.switchMainView(self.playlistview);
    },
    search: function() {
      self.switchMainView(self.searchView);
    },
    wishlist: function() {
      self.switchMainView(self.wishlistView);
    },
    admin: function() {
      self.switchMainView(self.adminView);
    },

    photo: function() {
      self.switchMainView(self.photoView);
    },

    defaultRoute: function(d) {
     /*if (this.currentview) {
        $(this.currentview.el).hide();
     }*/

      //alert(1);
      //$("#content").html(self.frontpageview.el);
      self.switchMainView(self.frontpageview);

      /*if (!self.frontpageview) {
    	 self.frontpageview =
    	}
    	else {}*/
    }

  });

  this.router = new Router();
  var isSubPage = Backbone.history.start();
}
