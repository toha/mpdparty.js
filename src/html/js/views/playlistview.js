var PlaylistView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    //this.collection = new PlaylistCollection();
    
    this.setElement(ich.playlistTmpl({})); 
    //_.bindAll(this, 'render');
    this.model.bind('change', this.render, this);
    //$("#content").append(this.el);
    
    
    $.getJSON('api/getplaylist', function(playlist) {
      self.model.set(playlist);
      
      $.getJSON('api/getcurrentsong', function(song) {
        self.model.set({ currentsong: song });
        self.scrollToCurrentSong();
      });         
      
    });    
    
    window.socket.on('playlistupdate', function (playlist) {
      self.model.set({ songs: playlist });
    });
    
    window.socket.on('playerupdate', function (song) {
      // Wenn neuer Song gesp
      self.model.set({ currentsong: song });
    });    
    
  },  
  
  scrollToCurrentSong: function() {
    var self = this;
    if (this.model.get("currentsong")) {
      $('html, body').animate({
           scrollTop: self.$(".playlistItem").eq(self.model.get("currentsong").pos).offset().top
       }, 750);
    }
  },
  
  events: {
  },
  render: function() {
    $(this.el).html($(ich.playlistTmpl(this.model.toJSON())).html());
    if (this.model.get("currentsong")) {
      this.$(".playlistItem").eq(this.model.get("currentsong").pos).addClass("playlistItemActive");
      $(".playlistItemPos", this.$(".playlistItem").eq(this.model.get("currentsong").pos)).html('<img src="/img/sound.png" />')
      
      this.$(".playlistItem:lt("+this.model.get("currentsong").pos+")").css("color", "#aaa")
    }
  }

});
