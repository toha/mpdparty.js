var PageMenuView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    this.setElement(ich.pageMenuTmpl()); 

    this.$('#menuFileUpload').fineUploader({
      debug: true,
      request: {
        endpoint: '/api/upload',
        paramsInBody: false
      },
      chunking: {
            enabled: true
        },
        resume: {
            enabled: false
        },
        retry: {
            enableAuto: false,
            showButton: false
        },
        display: {
            fileSizeOnSubmit: true
        },
        paste: {
            targetElement: $(document)
        },
        multiple: true,
        validation: {
          allowedExtensions: ['jpeg', 'jpg'],
          sizeLimit: 1024*1024*6
        },            
      
    }) .on('complete', function() {
      self.$(".qq-upload-success").remove();
      if (self.$(".qq-upload-list").children().length <= 0) {
        alert("Alle Fotos wurden erfolgreich hochgeladen. Es kann einige Minuten dauern, bis sie im Album angezeigt werden")
      }
    });  
  },  
  
  events: {
    "click #menuPlaylist": "onPlaylistClick",
    "click #menuSearchSong": "onSearchClick",
    "click #menuWhishlist": "onWishlistClick",
    "click #menuPhoto": "onPhotoClick"
  },
  
  onPlaylistClick: function(e) {
    window.app.router.navigate("/playlist", {trigger: true});
  },
  onSearchClick: function(e) {
  	window.app.router.navigate("/search", {trigger: true});
  },
  onWishlistClick: function(e) {
    window.app.router.navigate("/wishlist", {trigger: true});
  },
  onPhotoClick: function(e) {
    window.app.router.navigate("/photo", {trigger: true});
  }

});
