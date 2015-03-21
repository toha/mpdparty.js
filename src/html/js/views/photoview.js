var PhotoView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    this.setElement(ich.photosTmpl({})); 
    this.model.bind('change', this.render, this);
   
    $.getJSON('api/getphotos', function(photos) {
      console.log("PHOTOVIEW")
      console.log(photos);
      self.model.set(photos);
    });    
 
    window.socket.on('photoupdate', function (photos) {
      self.model.set({ photos: photos });
    });  
 
    //this.show();
    
    this.psInstance = null;

    
  },  
  
  events: {
  },
  
  show: function() {
    var self = this;
    (function(window, PhotoSwipe){
        if (self.psInstance) {
          delete self.psInstance;
        }
        self.psInstance = PhotoSwipe.attach( $(self.el)[0].querySelectorAll('#Gallery a'), {} );

    }(window, window.Code.PhotoSwipe));      
  },
    
  render: function() {
   $(this.el).html($(ich.photosTmpl(this.model.toJSON())).html());
   this.show();
  }

});


