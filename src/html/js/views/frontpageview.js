var FrontpageView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    this.setElement('<div id="frontpageView"></div>'); 
    
    this.menuview = new PageMenuView({});
    $(this.el).append(this.menuview.el);
    
    this.currentsongView = new CurrentsongView({model: new DummyModel()});
    $(this.el).prepend(this.currentsongView.el);
    
    
  },  
  
  events: {
  },
  

  

});


