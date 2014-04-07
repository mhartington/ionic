(function(ionic) {

ionic.Platform.ready(function() {
  if (ionic.Platform.isAndroid()) {
    androidKeyboardFix();
  }
  else if (ionic.Platform.isIOS()) {
    iOSKeyboardFix();
  }
});

function androidKeyboardFix() {
  var rememberedDeviceWidth = window.innerWidth;
  var rememberedDeviceHeight = window.innerHeight;
  var keyboardHeight;
 

  window.addEventListener('resize', resize);

  function resize() {

    //If the width of the window changes, we have an orientation change
    if (rememberedDeviceWidth !== window.innerWidth) {
      rememberedDeviceWidth = window.innerWidth;
      rememberedDeviceHeight = window.innerHeight;
      console.info('orientation change. deviceWidth =', rememberedDeviceWidth, ', deviceHeight =', rememberedDeviceHeight);

    //If the height changes, and it's less than before, we have a keyboard open
    } else if (rememberedDeviceHeight !== window.innerHeight &&
               window.innerHeight < rememberedDeviceHeight) {
      document.body.classList.add('footer-hide');
      //Wait for next frame so document.activeElement is set
      ionic.requestAnimationFrame(handleKeyboardChange);
    } else {
      //Otherwise we have a keyboard close or a *really* weird resize
      document.body.classList.remove('footer-hide');
    }

    function handleKeyboardChange() {
      //keyboard opens
      keyboardHeight = rememberedDeviceHeight - window.innerHeight;
      var activeEl = document.activeElement;
      if (activeEl) {
        //This event is caught by the nearest parent scrollView
        //of the activeElement
        ionic.trigger('scrollChildIntoView', {
          target: activeEl
        }, true);
      }

    }
  }
}
 
function iOSKeyboardFix(){
  var rememberedActiveEl;
  var alreadyOpen = false;
 
  window.addEventListener('focusin', fixScrollTop);
  window.addEventListener('ionic.showkeyboard', resizeOnKeyboardShow);
  window.addEventListener('ionic.hidekeyboard', resizeOnKeyboardHide);
 
  function fixScrollTop(e){
    if (e.srcElement.tagName === 'INPUT'){
      document.body.scrollTop = 0;
    }
  }
 
  function resizeOnKeyboardShow(e){
    rememberedActiveEl = document.activeElement;
    if (rememberedActiveEl) {
      //This event is caught by the nearest parent scrollView
      //of the activeElement
      if (Keyboard.isVisible){
        ionic.trigger('scrollChildIntoView', {
          keyboardHeight: e.keyboardHeight,
          target: rememberedActiveEl,
          firstKeyboardShow: !alreadyOpen
        }, true);
        if (!alreadyOpen) alreadyOpen = true;
      }
    }
  }
     
  function resizeOnKeyboardHide(){
    //wait to see if we're just switching inputs
    setTimeout(function(){
      if (!Keyboard.isVisible){
        alreadyOpen = false;
        ionic.trigger('resetScrollView', {
          target: rememberedActiveEl
        }, true);
      }
    }, 100);
  }
}

})(window.ionic);
