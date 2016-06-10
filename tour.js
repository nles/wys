$(function(){
  // create a placeholder element for the first step
  d = $("<div id='first-step' />")
  d.css("position","fixed").css("top",10).css("right",10)
  d.css("width",20).css("height",20)
  $("body").append(d)

  if(!tour.ended() && $(window).width() > 500){
    $.post(wys_cms_path+'wys/xhr/user_tour_status.php',{'action':'get'},function(response){
      response = $.parseJSON(response);
      // continue if user has not been given the tour
      if(response.status == "not_seen"){
        startWysTour()
      }
    });
  }
});

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
    tour.init();
    if(from_beginning){
      tour.restart();
    } else {
      tour.start();
    }
  },500);
}

var commonStepActions = function(t){
  stepNO = t.getCurrentStep()
  elem = $(".popover.tour-tour-"+stepNO)
  elem.css("left",parseInt(elem.css("left"))-20)
}

// tour properties
var tour = new Tour({
  backdrop: true,
  orphan: true,
  template: "<div class='popover tour'>"
    +"<div class='arrow'></div>"
    +"<h3 class='popover-title'></h3>"
    +"<div class='popover-content'></div>"
    +"<div class='popover-navigation'>"
    +"    <button class='btn btn-default' data-role='prev'>« Edellinen</button>"
    +"    <span data-role='separator'>&nbsp;</span>"
    +"    <button class='btn btn-default' data-role='next'>Seuraava »</button>"
    +" &nbsp; <button class='btn btn-default' data-role='end'>Sulje ohjeistus</button>"
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

tour.addStep({
  placement: "left",
  title: "Editorin opastus",
  content: "Tervetuloa sivueditoriin! "
  + "Tämä lyhyt ohjeistus näyttää miten pääset käsiksi "
  + "editorin keskeisimpiin toimintoihin.",
});
tour.addStep({
  element: "#first-step",
  placement: "left",
  title: "Editorin toiminnot",
  content: "Saat editorin toimintonapit näkyville viemällä hiiren "
  + "tämän oikeassa yläkulmassa näkyvän kolmion päälle.",
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
        tour.next()
      },500);
    });
  }
});
tour.addStep({
  element: "#wys-cms-dashboard",
  backdropPadding: 0,
  placement: "left",
  title: "Sisältöeditori",
  content: "Tästä napista avaat sisältöeditorin päänäkymän, jonka kautta pääset käsiksi kaikkiin sen toimintoihin.",
  onShown: function(p){ commonStepActions(p); }
});
tour.addStep({
  element: "#wys-open-editor",
  backdropPadding: 0,
  placement: "left",
  title: "Avaa muokkausnäkymä",
  content: "Tästä napista avaat <strong>aktiivisen sivun</strong> muokkausnäkymän.",
  onShown: function(p){ commonStepActions(p); }
});
tour.addStep({
  element: "#wys-enable-quick-edit-mode",
  backdropPadding: 0,
  placement: "left",
  title: "Pikamuokkaustila",
  content: "Tätä nappia klikkaamalla siirryt pikamuokkaustilaan.",
  onShown: function(p){ commonStepActions(p); }
});
tour.addStep({
  element: "#wys-enable-quick-edit-mode",
  backdropPadding: 0,
  placement: "left",
  title: "Pikamuokkaustilan alueet",
  content: "Pikamuokkaustilassa voit muokata suoraan kaikkea näkyvää sisältöä joka on ympyröity katkoviivoin."
  + "<div class='wys-quick-edit-area-example'><div class='editor'></div></div>",
  onShown: function(p){
    commonStepActions(p);
    new MediumEditor('.wys-quick-edit-area-example')
  }
});
tour.addStep({
  element: "#wys-enable-quick-edit-mode",
  backdropPadding: 0,
  placement: "left",
  title: "Pikamuokkaustilan muotoilut",
  content: "Voit muotoilla sisältöä pikamuokkaus&shy;tilassa maalaamalla muokattavan tekstin, ja valitsemalla "
  + "tekstin päälle ilmestyvästä työkalu&shy;valikosta sopivan muotoilu&shy;työkalun."
  + "<div class='wys-quick-edit-area-example'><div class='editor'>maalaa minut</div></div>",
  onShown: function(p){
    commonStepActions(p);
    new MediumEditor('.wys-quick-edit-area-example .editor')
  }
});
if($("#wys-cms-shortcuts").length > 0){
  tour.addStep({
    element: "#wys-cms-shortcuts",
    backdropPadding: 0,
    placement: "left",
    title: "Pikalinkit",
    content: "Tämän alavalikon kautta pääset nopeasti käsiksi editoidessa usein käytettyihin toimintoihin.",
    onShown: function(p){ commonStepActions(p); }
  });
}
tour.addStep({
  element: "#wys-cms-logout",
  backdropPadding: 0,
  placement: "left",
  title: "Kirjaudu ulos",
  content: "Kirjaudu ulos editorista klikkaamalla tästä.",
  onShown: function(p){ commonStepActions(p); }
});
tour.addStep({
  element: "#wys-cms-tour",
  backdropPadding: 0,
  placement: "left",
  title: "Ohjeistus",
  content: "Tästä napista voit avata tämän ohjeistuksen uudelleen.",
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
