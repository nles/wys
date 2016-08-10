// requirements: medium.js, jquery, fontawesome, bootstrap-tour, hint.css
// these get loaded through various cdns in wys_bootstrap
//
var wysToolbarOpen = false;
var hoveringWysTrigger = false;
var hoveringWysToolbar = false;
var hoveringWysShortcuts = false;
var animatingWysToolbar = false;
var wysToolbarWidth = 58;// 38px toolbar + 20px "padding"
var allowWysToolbarHide = true;

var openWysToolbar = function(){
  if(!animatingWysToolbar){
    animatingWysToolbar = true;
    wysToolbarOpen = true;
    wysToolbar.css('border-width','0 0 1px 1px');
    wysToolbar.animate({width:wysToolbarWidth},350,function(){
      animatingWysToolbar = false;
      wysToolbar.css('overflow','visible');
    });
  }
}
var closeWysToolbar = function(){
  if(!animatingWysToolbar){
    hoveringWysToolbar = false;
    hoveringWysTrigger = false;
    animatingWysToolbar = true;
    wysToolbarOpen = false;
    wysToolbar.css('overflow','hidden');
    wysToolbar.animate({width:'0'},350,function(){
      animatingWysToolbar = false;
      wysToolbar.css('border-width',0);
    });
  }
}
//
var initWysToolbar = function(){
  wysContainer.append(wysTrigger);
  wysContainer.append(wysToolbar);
  $("body").append(wysContainer);
  closeWysToolbar();

  var wysCmsShortcutsWrapper = $("#wys-cms-shortcuts-wrapper");
  var wysCmsShortcutsTrigger = $("a#wys-cms-shortcuts");
  var wysCmsShortcuts = wysCmsShortcutsWrapper.add(wysCmsShortcutsTrigger)

  var showWysCmsShortcutMenu = function(){
    wysCmsShortcutsWrapper.css("left",(wysCmsShortcutsWrapper.outerWidth()*-1)+20);
    wysCmsShortcutsWrapper.css("top",wysCmsShortcutsTrigger.position().top);
    wysCmsShortcutsWrapper.show();
  }
  var hideWysCmsShortcutMenu = function(){
    wysCmsShortcutsWrapper.hide();
  }

  // tooltip translations
  wysToolbar.find("#wys-cms-dashboard").attr('data-hint',i18next.t('tooltips.dashboard'));
  wysToolbar.find("#wys-open-editor").attr('data-hint',i18next.t('tooltips.editor'));
  wysToolbar.find("#wys-enable-quick-edit-mode").attr('data-hint',i18next.t('tooltips.quick-editor'));
  wysToolbar.find("#wys-cms-logout").attr('data-hint',i18next.t('tooltips.logout'));
  wysToolbar.find("#wys-cms-tour").attr('data-hint',i18next.t('tooltips.tour'));
  wysToolbar.find("#wys-save-quick-mode-changes").attr('data-hint',i18next.t('tooltips.save-changes'));
  wysToolbar.find("#wys-exit-quick-edit-mode").attr('data-hint',i18next.t('tooltips.exit-quick-edit'));

  // events
  wysTrigger.on('mousemove',function(){ hoveringWysTrigger = true; });
  wysTrigger.on('mouseout',function(){ hoveringWysTrigger = false; });
  wysToolbar.on('mousemove',function(){ setTimeout(function(){ hoveringWysToolbar = true; }, 2); });
  wysToolbar.on('mouseout',function(){ setTimeout(function(){ hoveringWysToolbar = false; }, 1); });
  wysCmsShortcuts.on('mousemove',function(){ hoveringWysShortcuts = true; });
  wysCmsShortcuts.on('mouseout',function(){ hoveringWysShortcuts = false; });

  setInterval(function(){
    if((hoveringWysToolbar || hoveringWysTrigger) && !wysToolbarOpen){ openWysToolbar(); }
    if(!hoveringWysToolbar && !hoveringWysTrigger && wysToolbarOpen){
      if(!wysQuickEditModeOn && allowWysToolbarHide) closeWysToolbar(); hideWysCmsShortcutMenu();
    }
    if(hoveringWysShortcuts){ showWysCmsShortcutMenu(); }
  },300);
}


// SHORTCUTS
var initWysShortcuts = function(){
  var has_shortcuts = false;
  $.get("/meta/editor_shortcuts.json",{ "_": $.now() },function(shortcut_data){
    var shortcuts = (typeof shortcut_data == "string") ? $.parseJSON(shortcut_data) : shortcut_data;
    for(var key in shortcuts){
      if (!shortcuts.hasOwnProperty(key)) continue;
      var shortcut = shortcuts[key];
      for(var sc_data in shortcut){
        var title = sc_data
        var path = shortcut[sc_data];
        sc_link = $("<a href='javascript:void(0);' class='wys-cms-shortcut-link'>"+title+"</a>");
        sc_link.attr('data-editor-path',path);
        $("#wys-shortcuts").append(sc_link);
        has_shortcuts = true;
      }
    }
    if(has_shortcuts){
      $("#wys-cms-shortcuts").show();
      $(".wys-cms-shortcut-link").click(function(){
        openEditorInModal($(this));
      });
    }
  })
};


// CMS IN MODAL WINDOW
var openEditorInModal = function(trigger){
  iframe_url = cms_active_edit_path; // default to edit path
  if(trigger.attr("id") == "wys-cms-dashboard") iframe_url = wys_cms_path
  if(trigger.data("editor-path")) iframe_url = wys_cms_path+trigger.data("editor-path")
  closeWysToolbar();
  vex.dialog.open({
    message: '',
    className: 'vex-theme-top cms-in-modal',
    showCloseButton: false,
    input: "<iframe id='wys-embedded-editor' src='"+iframe_url+"'></iframe>",
    callback: function(value) {
      // we get the latest changes only after a full page reload,
      // so lets do it automatically to avoid confusion
      window.location.reload()
    }
  });
};
var initEditorInModal = function(){
  $('#wys-open-editor, #wys-cms-dashboard').bind('click',function(){
    openEditorInModal($(this));
  });
};


// MEDIUM.JS POWERED QUICK EDITOR
var wysQuickEditModeOn = false;
var wysQuickEditModeAvailable = false;
var wysMediumEditor = null;
var initWysQuickEdit = function(){
  if($(".editable").length > 0){
    wysQuickEditModeAvailable = true
    wysToolbar.find('#wys-enable-quick-edit-mode').click(function(){
      enableWysQuickEditMode();
    });
    wysToolbar.find('#wys-save-quick-mode-changes').click(function(){
      wysQuickEditSave();
    });
    wysToolbar.find('#wys-exit-quick-edit-mode').click(function(){
      if(confirm(i18next.t('messages.confirm-quick-edit-exit'))){
         window.location.reload();
      }
    });
  } else {
    //wysToolbar.find('#wys-enable-quick-edit-mode').hide();
  }
}
var enableWysQuickEditMode = function(){
  wysToolbar.find(".quick-edit-mode-off").hide()
  wysToolbar.find(".quick-edit-mode-on").show()
  wysQuickEditModeOn = true;
  if(!wysMediumEditor){
    wysMediumEditor = new MediumEditor('.editable', {
      paste: {
        forcePlainText: true
      },
    });
    wysMediumEditor.subscribe('editableInput', function(event, editable) {
      $e = $(editable);
      if(!$e.hasClass('edited')) $e.addClass('edited');
    });
  } else {
    $(".medium-editor-toolbar").show();
    $(".editable").prop("contenteditable",true);
  }
  $(".editable").addClass("edit-mode-on");
  $(".editable.inline").append("<div class='wys-wrap-preventer'></div>")
  // scroll to first editable element if not visible
  bottomPX = $(window).scrollTop()+$(window).height();
  firstEditablePX = $(".editable").first().offset().top;
  if(firstEditablePX > bottomPX){
    $('html, body').animate({scrollTop: firstEditablePX-100}, 1000);
  }
}
var disableWysQuickEditMode = function(){
  wysToolbar.find(".quick-edit-mode-off").show()
  wysToolbar.find(".quick-edit-mode-on").hide()
  wysQuickEditModeOn = false;
  // no need to destroy,
  // just hide and set contenteditable to false
  $(".medium-editor-toolbar").hide();
  $(".editable").prop("contenteditable",false);
  $(".editable").removeClass("edit-mode-on");
  $(".editable").removeClass("edited");
}
var wysQuickEditSave = function(){
  saveLoadModal = vex.dialog.open({
    message: '',
    className: 'vex-theme-top xhr-loader',
    showCloseButton: false,
    escapeButtonCloses: false,
    overlayClosesOnClick: false,
    input: ""
      + "<div class='loader-wrapper'>"
      + "  <div class='error'>Virhe! Tallennus ei onnistunut.</div>"
      + "  <div class='success'>Tallennettu onnistuneesti.</div>"
      + "  <div class='loading'>"
      + "    <div class='loader-text'>Tallennetaan ... </div>"
      + "    <div class='loader'></div>"
      + "  </div>"
      + "</div>"
  })

  var editedElements = $(".editable.edited");
  var xhrCompleteCount = 0;
  var xhrStatus = "success"; // success even if no requests are made
  editedElements.each(function(){
    var editElement = $(this);
    var input = {};
    input['slug'] = editElement.data('slug');
    input['eid'] = editElement.data('entry-id');
    input['field'] = editElement.data('field');
    // remove wrap preventing elements from inline editors
    editElement.find(".wys-wrap-preventer").remove();
    input['content'] = editElement.html();
    type = editElement.data('type')
    $.post(wys_cms_path+'wys/xhr/save_'+type+'.php',input,function(resp){
      xhrCompleteCount++;
      resp = $.parseJSON(resp);
      // if one fails, we just mark this batch as having an error...
      // TODO: better error handling (determine which one fails etc.)
      if(resp.status == "error") xhrStatus = "error";
    });
  })
  var checkXhrComplete = setInterval(function(){
    if(xhrCompleteCount == editedElements.length){
      clearInterval(checkXhrComplete);
      // saved once all xhr-requests finish
      setTimeout(function(){
        $(".xhr-loader .loading").fadeOut(function(){
          $(".xhr-loader ."+xhrStatus).fadeIn()
          setTimeout(function(){
            vex.close(saveLoadModal.data().vex.id)
            disableWysQuickEditMode();
            // NOTE: reload might not be optimal here, but
            // destroying medium stuff is not really working
            // optimally either...
            window.location.reload();
          }, 1000);
        })
      }, 1000);
    }
  },100)
}
$(window).bind('keydown', function(event) {
  var preventDef = function(e){
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }
  if (event.ctrlKey || event.metaKey) {
    switch (String.fromCharCode(event.which).toLowerCase()) {
      case 's':
        if(wysQuickEditModeOn) {
          preventDef(event);
          wysQuickEditSave();
        }
      case 'e':
        if(wysQuickEditModeAvailable) {
          preventDef(event);
          openWysToolbar();
          enableWysQuickEditMode()
        }
      case 'u':
          preventDef(event);
          $('#wys-open-editor').trigger('click');
      break;
    }
  }
});

// INIT ALL COMPONENTS
var wysContainer, wysTrigger, wysToolbar
// call after dom & translations ready
var wysMainSetup = function(){
  // setup tour
  setupWysTour();
  // elements
  wysContainer = $("<div id='wys-editor-container' />")
  wysTrigger = $("<div id='wys-editor-trigger' />")
  wysToolbar = $("<div id='wys-editor-toolbar' />")
  // get the main template and init everything
  $.get(wys_cms_path+'wys/toolbar_template.html',function(d){
    wysToolbar.html(d);
    initWysToolbar();
    initWysShortcuts();
    initEditorInModal();
    initWysQuickEdit();
    initWysTour();
  });
};
