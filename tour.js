var initWysTour = function(){
  $("#wys-cms-tour").click(function(){
    startWysTour(true);
    closeWysToolbar();
  });
}

var startWysTour = function(from_beginning){
  stepNO = parseInt(localStorage.getItem('tour_current_step'));
  allowWysToolbarHide = false;
  if(stepNO >= 1){
    animatingWysToolbar = false;
    openWysToolbar();
  }
  setTimeout(function(){
    bootstrapTour.init();
    if(from_beginning){
      bootstrapTour.restart();
    } else {
      bootstrapTour.start();
    }
  },500);
}

var commonStepActions = function(t){
  stepNO = t.getCurrentStep()
  elem = $(".popover.tour-tour-"+stepNO)
  elem.css("left",parseInt(elem.css("left"))-20)
}

var bootstrapTour = null;
var setupWysTour = function(){
  // create a placeholder element for the first step
  d = $("<div id='open-toolbar-step' />")
  d.css("position","fixed").css("top",10).css("right",10)
  d.css("width",20).css("height",20)
  $("body").append(d)

  // tour properties
  bootstrapTour = new Tour({
    backdrop: true,
    orphan: true,
    template: "<div class='popover tour'>"
      +"<div class='arrow'></div>"
      +"<h3 class='popover-title'></h3>"
      +"<div class='popover-content'></div>"
      +"<div class='popover-navigation'>"
      +"    <button class='btn btn-default' data-role='prev'>« "+i18next.t("tour.previous")+"</button>"
      +"    <span data-role='separator'>&nbsp;</span>"
      +"    <button class='btn btn-default' data-role='next'>"+i18next.t("tour.next")+" »</button>"
      +" &nbsp; <button class='btn btn-default' data-role='end'>"+i18next.t("tour.close")+"</button>"
      +"</div>"
      +"</div>",
    onShow: function(t){
      // disable scrolling temporarily
      $("html").css("overflow","hidden");
      // disable toolbar links temporarily
      $("#wys-editor-toolbar a").bindFirst('click.disabled',function(e){
        e.stopImmediatePropagation();
        e.preventDefault();
        // flash the next button
        nextButton = $(".popover.tour button[data-role='next']");
        nextButton.fadeOut(200,function(){ $(this).fadeIn(200, function(){
          nextButton.fadeOut(200,function(){ $(this).fadeIn(200); });
        }); });
        return false;
      });
    },
    onEnd: function(t){
      // enable scrolling again
      $("html").css("overflow","auto");
      // enable toolbar links again
      $("#wys-editor-toolbar a").unbind('click.disabled');
      allowWysToolbarHide = true;
      // signal cms that the tour has been seen
      $.post(wys_cms_path+'wys/xhr/user_tour_status.php',{'action':'set'})
    }
  });

  bootstrapTour.addStep({
    placement: "left",
    title: i18next.t('tour.first-step-title'),
    content: i18next.t('tour.first-step-content'),
  });
  bootstrapTour.addStep({
    element: "#open-toolbar-step",
    placement: "left",
    title: i18next.t('tour.open-toolbar-title'),
    content: i18next.t('tour.open-toolbar-content'),
    backdropPadding: 10,
    onShown: function(p){
      stepNO = p.getCurrentStep()
      elem = $(".popover.tour-tour-"+stepNO)
      elem.find("button[data-role='next']").hide();
      closeWysToolbar();
      $(".tour-step-background")
      .css("top",0).css("right",0).css("left","auto")
      .css("border-top-right-radius",0)
      // use hover over editor as the trigger for next slide
      $("#wys-editor-trigger").one("mouseenter click",function(){
        setTimeout(function(){
          bootstrapTour.next()
        },500);
      });
    }
  });
  bootstrapTour.addStep({
    element: "#wys-cms-dashboard",
    backdropPadding: 0,
    placement: "left",
    title: i18next.t('tour.cms-dashboard-title'),
    content: i18next.t('tour.cms-dashboard-content'),
    onShown: function(p){ commonStepActions(p); }
  });
  bootstrapTour.addStep({
    element: "#wys-open-editor",
    backdropPadding: 0,
    placement: "left",
    title: i18next.t('tour.cms-editor-title'),
    content: i18next.t('tour.cms-editor-content'),
    onShown: function(p){ commonStepActions(p); }
  });
  bootstrapTour.addStep({
    element: "#wys-enable-quick-edit-mode",
    backdropPadding: 0,
    placement: "left",
    title: i18next.t('tour.quick-editor-title'),
    content: i18next.t('tour.quick-editor-content'),
    onShown: function(p){ commonStepActions(p); }
  });
  bootstrapTour.addStep({
    element: "#wys-enable-quick-edit-mode",
    backdropPadding: 0,
    placement: "left",
    title: i18next.t('tour.quick-editor-explanation-title'),
    content: i18next.t('tour.quick-editor-explanation-content')
    + "<div class='wys-quick-edit-area-example'><div class='editor'></div></div>",
    onShown: function(p){
      commonStepActions(p);
      new MediumEditor('.wys-quick-edit-area-example')
    }
  });
  bootstrapTour.addStep({
    element: "#wys-enable-quick-edit-mode",
    backdropPadding: 0,
    placement: "left",
    title: i18next.t('tour.quick-editor-usage-title'),
    content: i18next.t('tour.quick-editor-usage-content')
    + "<div class='wys-quick-edit-area-example'><div class='editor'>"+i18next.t('tour.quick-editor-usage-highlight')+"</div></div>",
    onShown: function(p){
      commonStepActions(p);
      new MediumEditor('.wys-quick-edit-area-example .editor')
    }
  });
  if($("#wys-cms-shortcuts").length > 0){
    bootstrapTour.addStep({
      element: "#wys-cms-shortcuts",
      backdropPadding: 0,
      placement: "left",
      title: i18next.t('tour.shortcuts-title'),
      content: i18next.t('tour.shortcuts-content'),
      onShown: function(p){ commonStepActions(p); }
    });
  }
  bootstrapTour.addStep({
    element: "#wys-cms-logout",
    backdropPadding: 0,
    placement: "left",
    title: i18next.t('tour.logout-title'),
    content: i18next.t('tour.logout-content'),
    onShown: function(p){ commonStepActions(p); }
  });
  bootstrapTour.addStep({
    element: "#wys-cms-tour",
    backdropPadding: 0,
    placement: "left",
    title: i18next.t('tour.tour-restart-title'),
    content: i18next.t('tour.tour-restart-content'),
    onShown: function(p){
      stepNO = p.getCurrentStep()
      elem = $(".popover.tour-tour-"+stepNO)
      elem.find("button[data-role='next']").hide();
      commonStepActions(p);
    }
  });


  // bind first extension to jquery to allow disabling all
  // events temporarily
  $.fn.bindFirst = function(name, fn) {
    var elem, handlers, i, _len;
    this.bind(name, fn);
    for (i = 0, _len = this.length; i < _len; i++) {
      elem = this[i];
      handlers = jQuery._data(elem).events[name.split('.')[0]];
      handlers.unshift(handlers.pop());
    }
  };

  if(!bootstrapTour.ended() && $(window).width() > 500){
    $.post(wys_cms_path+'wys/xhr/user_tour_status.php',{'action':'get'},function(response){
      response = $.parseJSON(response);
      // continue if user has not been given the tour
      if(response.status == "not_seen"){
        startWysTour()
      }
    });
  }

}
