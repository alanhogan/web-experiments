/*
 *  linkURLs, a jQuery plugin developed for Simperium’s Simplenote by Alan Hogan on 2011-01-14.
 *  Usage:
 *  $('#something').linkURLs().
 *  
 *  Uses Gruber’s updated liberal URL matcher.
 */
(function($){
	jQuery.fn.linkURLs = function(){
		// Begin with Gruber's revised pattern matcher: http://daringfireball.net/2010/07/improved_regex_for_matching_urls
		var gruber_pattern = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;

		var has_protocol_pattern = /^[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])/i; //Note this exactly matches a substring of the above pattern.
		
		this.each(function(){
			jQuery(':not(a, input, textarea, button, a *)', this).andSelf().contents().filter(function(){
	            return this.nodeType === 3; //Text nodes only
	        }).wrap('<span class="linkURLs-parse" />');
	
			jQuery('.linkURLs-parse', this).each(function(i){
				// Wrap any URLs in <a class=linkURLs-match />
				jQuery(this).html(jQuery(this).text().replace(gruber_pattern,'<a class="linkURLs-match">$&</a>'));
				// Now add the href  attribute
				jQuery('.linkURLs-match', this).each(function(){
					var $me = $(this);
					var link = $me.text();
					if (!has_protocol_pattern.test(link)) {
						//assume http
						link = 'http://'+link;
					}
					$me.attr('href', link);
				}).removeClass('linkURLs-match');	
				jQuery(this).replaceWith(jQuery(this).html());
			}); //end each (a.linkURLs-parse)	
		}); //end each (matched item)
	return this;
	};
})(jQuery);
