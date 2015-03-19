var CurrentsongView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    this.setElement(ich.currentSongTmpl({})); 
    this.model.bind('change', this.render, this);
    
    this.timeInfoInterval = null;
    this.timeInfoIntervalValue = 5;
    
    $.getJSON('api/getcurrentsong', function(song) {
      self.model.set(song);
      self.updateTimeInfo();
    });      
    
    window.socket.on('playerupdate', function (song) {
      self.model.set(song);
      self.updateTimeInfo();
    });
    
    $(this.el).click(function() {
      window.app.router.navigate("/playlist", {trigger: true});
      window.app.playlistview.scrollToCurrentSong();
    })
    
    this.timeInfoInterval = setInterval($.proxy( this.updateTimeInfo, this ), this.timeInfoIntervalValue*1000);
    
    
  },  
  
  events: {
  },
  
  updateTimeInfo: function() {
    var righttime = parseInt(this.model.get("timeelapsed"));
    
    var diffsincelast = parseInt((new Date().getTime() - this.model.get("timeelpaseddate")) / 1000);
    
    righttime += diffsincelast;
    this.model.set("realtimeelapsed", righttime);
  },
    
  render: function() {
   $(this.el).html($(ich.currentSongTmpl(this.model.toJSON())).html());
   var songtime = parseInt(this.model.get("time"));
   var timeelapsed = this.model.get("realtimeelapsed");
   var percent = parseInt(timeelapsed / songtime  * 100);
   if (percent >= 0) {
     $(this.el).css("background-size", new String(100-percent) + "% 100%")
   }
    
    
  }

});


