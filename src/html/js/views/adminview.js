var AdminView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    this.setElement(ich.adminTmpl({})); 
    this.model.bind('change', this.render, this);
    
    $.getJSON('api/getwishlist', function(wishlist) {
      self.filterServerList(wishlist);
      console.log(wishlist)
    }); 
    
    $.getJSON('api/getphotowishlist', function(wishlist) {
      console.log("photolist")
      console.log(wishlist)
      self.model.set(wishlist);
    });     
    
    window.socket.on('wishlistupdate', function (wishlist) {
      self.filterServerList({ songs: wishlist });
    });
    
    window.socket.on('photowishlistupdate', function (photowishlist) {
      self.model.set({ photos: photowishlist });
      console.log("self.model")
      console.log(self.model)
    });    
    
  },  
  
  events: {
    "click .adminlistAcceptSong" : "onAcceptSong",
    "click .adminlistRefuseSong" : "onRefuseSong",
    "click .adminphotoRefuse": "onRefusePhotos",
    "click .adminphotoaccept": "onAcceptPhotos",
    "click .adminphotomarkall": "onMarkAllPhotos"
  },
  
  filterServerList: function(wishlist) {
    var self = this;
    var newwishlist = [];
    $.each(wishlist.songs, function(idx, wishsong) {
      if (wishsong.acceptTime) {
      }
      else {
        newwishlist.push(wishsong);  
      }
      
    });
    
    self.model.set({songs: newwishlist});
  },
  
  onAcceptSong: function(e) {
    var filename = $(".adminWishItemFilename", $(e.target).parent().parent()).val();
      
    $(e.target).parent().parent().append(ich.adminAcceptSongPlaylistTmpl(window.app.playlistview.model.toJSON()));
    $(".adminlistAcceptSongInsertAfter", $(e.target).parent().parent()).click(function() {
      var playlistPos = $(".adminlistAcceptSongPlaylistSelect", $(e.target).parent().parent()).val();
      $.post("/api/admin/acceptSong", { file: filename, pos: parseInt(playlistPos)+1 }, function(msg) {
        console.log(msg)
      });      
    });
    
    $(".adminlistAcceptSongInsertEnd", $(e.target).parent().parent()).click(function() {
      $.post("/api/admin/acceptSong", { file: filename, pos:-1 }, function(msg) {
        console.log(msg)
      });        
    });    
    
  },
  
  onRefuseSong: function(e) {
    var filename = $(".adminWishItemFilename", $(e.target).parent().parent()).val();
    
    var reasonform = ich.adminRefuseSongPlaylistTmpl()
    $(e.target).parent().parent().append(reasonform);
    $(".adminlistRefuseSongSend", reasonform).click(function() {
      var reason = $(".adminRefuseSongPlaylistReason", reasonform).val();
      $.post("/api/admin/rejectSong", { file: filename, reason: reason }, function(msg) {
        console.log(msg)
      });       
    });
    
    
  },
  
  onRefusePhotos: function(e) {
    var filenames = []
    $.each(this.$("input:checkbox:checked"), function(idx, value) {
      filenames.push($(this).val());
    });
    
    if (filenames.length >0) {
      $.post("/api/admin/refusephoto", { files: filenames }, function(msg) {
        console.log(msg)
      });     
    }    
  },
  
  onAcceptPhotos: function(e) {
    var filenames = []
    $.each(this.$("input:checkbox:checked"), function(idx, value) {
      filenames.push($(this).val());
    });
    
    if (filenames.length >0) {
      $.post("/api/admin/acceptphoto", { files: filenames }, function(msg) {
        console.log(msg)
      });     
    }
  },
  
  onMarkAllPhotos: function(e) {
    this.$("input:checkbox").attr('checked', true);
  },
  
  render: function() {
    $(this.el).html($(ich.adminTmpl(this.model.toJSON())).html());
  }

});


