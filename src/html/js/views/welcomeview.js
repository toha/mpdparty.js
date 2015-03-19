var WelcomeView = Backbone.View.extend({
  initialize: function(a) {
    var self = this;
    this.setElement(ich.welcomeViewTmpl()); 
    
    $("body").append(this.el);
    
  },  
  
  events: {
  	"click #welcomeViewBtn": "onGo"
  },
  
  onGo: function(e) {
  	var name = this.$("#welcomeViewUsername").val();
  	
  	if (name) {
  	  $.post("/api/newuser", { name: name }, function(msg) {
  	   if (msg === "ok") {
        window.username = name;
        $.cookie('uname', name, { expires: 7, path: '/' });
        $("#welcomeView").remove();
        window.app = new Webapp();  	   
  	   } 
  	   else {
  	     alert("Der Name ist leider schon vergeben. Bitte einen anderen wählen.")
  	   }
  	 });
    }
  }

});


