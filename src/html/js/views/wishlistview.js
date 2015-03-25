var WishlistView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    //this.collection = new PlaylistCollection();
    
    this.setElement(ich.wishlistTmpl({})); 
    //_.bindAll(this, 'render');
    this.model.bind('change', this.render, this);
    //$("#content").append(this.el);
    
    
    $.getJSON('api/getwishlist', function(wishlist) {
      self.processWishlistData(wishlist);
      //self.model.set(wishlist);
    }); 
    
    window.socket.on('wishlistupdate', function (wishlist) {
      self.processWishlistData({ songs: wishlist });
    });
    
  },  
  
  processWishlistData: function(wishlist) {
    var myusername = $.cookie("uname");
    
    var newwishlist = {songs: []};
    $.each(wishlist.songs, function(index, wishsong) {
      
      if (wishsong.username === myusername) {
        wishsong.fromMe = true;
      }
      else {
      }
      
      
      var wishtime = wishsong.date / 1000;
      var nowdate = new Date().getTime()/1000;
      var diffminutes = parseInt((nowdate - wishtime) / 60);
      wishsong.timeago = diffminutes;
      
      newwishlist.songs.push(wishsong);
    });    
    
    
    this.model.set(newwishlist);
  },
  
  events: {
  },
  
    
  render: function() {
    $(this.el).html($(ich.wishlistTmpl(this.model.toJSON())).html());
  }

});


