var SearchView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    this.setElement(ich.searchTmpl({})); 
    //this.model.bind('change', this.render, this);

    this.lastKeyDown = new Date().getMilliseconds();
    this.wasRecentKeyDown = false;
    
    this.keyTimeout = null;
    
  },  
  
  events: {
    "keydown #searchInputVal": "onKeyDown",
    "click .searchResultItem": "onSongClick",
    "click .searchPopularItem": "onPopularClick",
    "click #searchResultReset": "onReset"
  },
  
  onKeyDown: function(e) {
    var self = this;
    if (e.keyCode === 13) {
      clearTimeout(this.keyTimeout);
      this.doSearch();
    }
    else {
      clearTimeout(this.keyTimeout);
      this.keyTimeout = setTimeout(function() { self.doSearch(); }, 1700)
      self.$("#searchIntro").show();
      self.$("#searchResult").hide();
      
    }
    
  },
  onReset: function() {
    this.$("#searchInputVal").val("");   
    self.$("#searchIntro").show();
    self.$("#searchResult").hide();      
  },
  
  doSearch: function() {
    var self = this;
    var query = this.$("#searchInputVal").val();
    if (query && query.length >= 4) {
      this.model.set("currentQuery",query);
      $.post("/api/search", { query: query }, function(msg) {
       self.model.set("songs", msg.result)
       var songshtml = $(ich.searchResultTmpl(self.model.toJSON()));
       
       self.$("#searchIntro").hide();
       if (self.$("#searchResult").length > 0) {
        self.$("#searchResult").replaceWith(songshtml);
        self.$("#searchResult").show();
       }
       else {
         $(self.el).append(songshtml);
         
         self.$(".searchResultItem").eq(0).addClass("roundedtop");
         self.$("#searchResult").show();
       }
       
      });  
   }  
    
  },
  
  onSongClick: function(e) {
    var c = confirm('Soll das Lied "'+$(".searchResultItemTitle", e.currentTarget).text()+'" zur Wunschliste hinzugefügt werden?');
    if (c) {
      var wish = {
        filename: $(".searchResultItemFile", e.currentTarget).val(),
        artist: $(".searchResultItemArtist", e.currentTarget).text(),
        title: $(".searchResultItemTitle", e.currentTarget).text()
      };
      $.post("/api/addsongtowishlist", { item: wish }, function(msg) {
        window.app.router.navigate("/wishlist", {trigger: true});
      });        
      
    }
  },
    
  onPopularClick: function(e) {
    this.$("#searchInputVal").val($(e.currentTarget).text());
    this.doSearch();
  },
    
  render: function() {
    $(this.el).html($(ich.searchTmpl(this.model.toJSON())).html());
  }

});


