var PageView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    this.setElement(ich.pageTmpl()); 
    
    $("body").append(this.el);
  },  
  
  events: {
    "click header": "onHeaderClick",
    "click #homeBtn": "onHeaderClick"
  },
  
  onHeaderClick: function(e) {
    window.app.router.navigate("/", {trigger: true});
  }
  

  

});


