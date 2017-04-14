// © Alan Hogan 2010
// contact NoSpam <at> alanhogan.com

var Resume = {
	config: {
		debug: true,
		animationLength: 300,
		selectors: {
			contentLayer: '#content_level',
			overlayBg: '#overlay_bg',
			overlayWrap: '#overlay_wrap',
			overlayBox: '.overlay_box',
			contactBtn: '#r_contact_link',
			colophonBtn: '#show_colophon_button',
			colophon: '#colophon',
			contactForm: '#contact_form',
			closeBtn: '.close_overlay_box',
			toggleInactive: 'inactive',
			toggleActive: 'active',
			toggleSet: '.toggle',
			toggleOption: '.toggle-option'
		},
		DomGoodies: '<div id="overlay_bg" class="hidden"></div>' +
			'<div id="overlay_bg_aquarium" class="hidden"></div>' +
			'<div id="overlay_wrap" class="hidden"></div>' +
			'<div id="overlay_super" class="hidden"></div>',
		contactFormHtml: null,
		colophonHtml: null,
		errorMsg: {
			generic: '<p class="error_message"><strong>I&rsquo;m sorry,</strong> but something went wrong.</p>'
		}
	},
	factories: {
		overlayBox: function(content) {
			return '<div class="overlay_box">' + content + '<div class="close_overlay_box">Close</div></div>';
		}
	},
	functions: {
		overlayBox: function(content) {
			$(Resume.config.selectors.contentLayer).addClass('blurMyself1');	
			$(Resume.config.selectors.overlayBg).fadeIn(Resume.config.animationLength);
			$(Resume.config.selectors.overlayWrap).html(Resume.factories.overlayBox(
				content
			)).show('drop', {'direction':'up'}, Resume.config.animationLength,
				function(){ // on complete
					$(Resume.config.selectors.contentLayer).removeClass('blurMyself1').addClass('blurMyself2');	
				}
			);
					
		},
		showContactForm: function() {
			Resume.functions.overlayBox(Resume.config.contactFormHtml);
		},
		showColophon: function() {
			if(typeof Resume.config.colophonHtml !== 'string') {
				Resume.config.colophonHtml = Resume.config.errorMsg.generic;
				if(Resume.config.debug && window.console) {console.log('Missing colophon HTML.'); }
			}
			Resume.functions.overlayBox(Resume.config.colophonHtml);
		},
		closeOverlayBox: function() {
			$(Resume.config.selectors.contentLayer).addClass('blurMyself1').removeClass('blurMyself2');
			$(Resume.config.selectors.overlayBg).fadeOut(Resume.config.animationLength);
			$(Resume.config.selectors.overlayWrap).hide('drop', {direction:'up'}, 
				Resume.config.animationLength, function(){
				$(Resume.config.selectors.overlayBox).remove();
				$(Resume.config.selectors.contentLayer).removeClass('blurMyself1');
			});
		}
	}
};

// On load
$(function(){
	// Add elements we can play with, animate, and toggle for fun and profit
	$('body').append(Resume.config.DomGoodies);
	
	// Hide this that should be hidden with JS enabled and vice versa
	$('.js-enabled, .js-show').show();
	$('.no-js-fallback, .js-hide').hide();
	
	// Add live events  =======
	// Mail me
	$('.mail_to_me').live('click', function(){
		document.location='mailto:'+$(this).text();
	});
	// Closing overlay boxes
	$(Resume.config.selectors.overlayBg).live('click', function(){
		if(Resume.config.debug && window.console) {console.log('overlayBg click event. About to closeOverlayBox().');}
		Resume.functions.closeOverlayBox();
	});
	$(Resume.config.selectors.overlayCloseBtn).live('click', function(){
		//Todo, accept action from tabbed focus, e.g. space/enter
		if(Resume.config.debug && window.console) {console.log('overlayCloseBtn click event. About to closeOverlayBox().');}
		Resume.functions.closeOverlayBox();
	});
	$(Resume.config.selectors.overlayWrap).live('click', function(event){
		if(event.target === this) {
			if(Resume.config.debug && window.console) {console.log('overlayWrap clicked. About to closeOverlayBox');}
			$(Resume.config.selectors.overlayBg).click();
		} else {
			if(Resume.config.debug && window.console) {console.log('overlayWrap click event, but not not the target. Not going to closeOverlayBox');}
		}
	});
	// Toggles
	$(Resume.config.selectors.toggleOption).live('click', function(){
		
		if(Resume.config.debug && window.console) {console.log('Clicked a toggle.');}
		
		var $me = $(this);
		// Un-select the other buttons
		$me.closest(Resume.config.selectors.toggleSet).children(Resume.config.selectors.toggleOption).
			removeClass(Resume.config.selectors.toggleActive).
			addClass(Resume.config.selectors.toggleInactive);
		// Select this button
		$me.
			addClass(Resume.config.selectors.toggleActive).
			removeClass(Resume.config.selectors.toggleInactive);
		// Do whatever the button tells us
		$me.closest($me.attr('data-r-scope')).removeClass($me.attr('data-r-class-out')).addClass($me.attr('data-r-class-in'));
		if($me.attr('data-r-text-variant')) {
			
			if(Resume.config.debug && window.console) {console.log('data-r-text-variant detected');}
			$('[data-r-mode-text]',
				$me.closest($me.attr('data-r-scope'))
			).each(function(){
				var $morph = $(this);
				var strings = jQuery.parseJSON($morph.attr('data-r-mode-text'));
				if(Resume.config.debug && window.console) {console.log('Strings: '+strings+'.');}
				$morph.text(strings[$me.attr('data-r-text-variant')]);
			});
		}
		
		if(Resume.config.debug && window.console) {console.log('Finished.');}
	});
	
	// Extract content from DOM 
	//Todo: I smell repeated code…
	var $colophon = $(Resume.config.selectors.colophon);
	if($colophon.size() === 1) {
		Resume.config.colophonHtml = $colophon.html();
		$colophon.remove();
	}
	var $contactForm = $(Resume.config.selectors.contactForm);
	if($contactForm.size() === 1) {
		Resume.config.contactFormHtml = $contactForm.html();
		$contactForm.remove();
	}
	
	// Wire up controls
	// The contact-me button
	$(Resume.config.selectors.contactBtn).click(function(){
		// Fall through to manual link if we can't show the form
		if( ! Resume.config.contactFormHtml) {return true;}
		//show form
		Resume.functions.showContactForm();
		return false;
	});
	//Show colophon
	$(Resume.config.selectors.colophonBtn).click(function(){
		Resume.functions.showColophon();
		return false;
	});
	// Close overlays:
	$(Resume.config.selectors.closeBtn).live('click', function(){
		Resume.functions.closeOverlayBox();
	});
	//Todo: listen for "esc" to close overlay
});