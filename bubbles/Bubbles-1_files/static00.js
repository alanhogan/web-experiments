(function() {
  var __slice = Array.prototype.slice;

  (function($) {
    $.fn.extend({
      bubble: function(options) {
        var settings, word, _i, _len, _ref,
          _this = this;
        this.defaultOptions = {
          wrapperClassName: 'bubbling-unit',
          sourceClassName: 'bubbling-source',
          maskClassName: 'bubbling-mask bubbling-mask-behind',
          bubbleClassName: 'bubbling-bubble',
          bubbleBracketsClassName: 'bubbling-invis-brackets',
          cssPropertiesToCopy: 'padding line-height font color'.split(' '),
          onlyBubbleTheseWords: false,
          matchAllowedWordsCaseSensitively: false,
          checkForMalformedBubbles: false,
          failedBubbleClassName: 'bubbling-erroneous-bubble',
          failedBubbleBracketsClassName: 'bubbling-failed-brackets'
        };
        settings = $.extend({}, this.defaultOptions, options);
        this.strictBubbleRegex = /(\{\{)([^\{\}<>&"'\n\r]+)(\}\})/g;
        this.looseBubbleRegex = /(\{\{?)([^\{\}<>&"'\n\r]+?)(\}\}|\}(?!\}))/g;
        this.bubbleReplacement = "<span class='" + (_.escape(settings.bubbleClassName)) + "'><span class='" + (_.escape(settings.bubbleBracketsClassName)) + "'>$1</span>$2<span class='" + (_.escape(settings.bubbleBracketsClassName)) + "'>$3</span></span>";
        this.bubbleCandidateReplacement = "<span class='-bubbling-bubble-candidate-'><span class='-bubbling-brackets-1-'>$1</span><span class='-bubbling-content-'>$2</span><span class='-bubbling-brackets-2-'>$3</span></span>";
        if (settings.onlyBubbleTheseWords) {
          this.allowedBubbleWordHash = {};
          _ref = settings.onlyBubbleTheseWords;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            word = _ref[_i];
            this.allowedBubbleWordHash[settings.matchAllowedWordsCaseSensitively ? word : word.toLowerCase()] = true;
          }
        }
        this.copyCssProperties = function($from, $to) {
          var map, prop, _j, _len2, _ref2;
          map = {};
          _ref2 = settings.cssPropertiesToCopy;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            prop = _ref2[_j];
            map[prop] = $from.css(prop);
          }
          return $to.css(map);
        };
        this.looseCopyBubbled = function($from, $to) {
          var $candidate, $tmpDom, $word, valid;
          $tmpDom = $('<div>' + $from[0].value.replace(this.looseBubbleRegex, this.bubbleCandidateReplacement) + '</div>');
          while (true) {
            $candidate = $tmpDom.find('.-bubbling-bubble-candidate-:first');
            if (!($candidate.length > 0)) break;
            valid = true;
            valid && (valid = $candidate.find('.-bubbling-brackets-1-').text() === '{{' && $candidate.find('.-bubbling-brackets-2-').text() === '}}');
            if (settings.onlyBubbleTheseWords && valid) {
              word = $candidate.find('.-bubbling-content-').text();
              valid && (valid = this.allowedBubbleWordHash[settings.matchAllowedWordsCaseSensitively ? word : word.toLowerCase()] != null);
            }
            if (valid) {
              $candidate[0].className = settings.bubbleClassName;
              $word = $candidate.find('.-bubbling-content-');
              $word.replaceWith($word.contents());
              $candidate.find('span').each(function(i, span) {
                return span.className = settings.bubbleBracketsClassName;
              });
            } else {
              if (settings.checkForMalformedBubbles) {
                $candidate[0].className = settings.failedBubbleClassName;
                $word = $candidate.find('.-bubbling-content-');
                $word.replaceWith($word.contents());
                $candidate.find('span').each(function(i, span) {
                  return span.className = settings.failedBubbleBracketsClassName;
                });
              } else {
                $candidate.replaceWith($candidate.text());
              }
            }
          }
          return $to.empty().append($tmpDom.contents());
        };
        this.strictCopyBubbled = function($from, $to) {
          return $to[0].innerHTML = $from[0].value.replace(this.strictBubbleRegex, this.bubbleReplacement);
        };
        this.copyBubbled = function() {
          if (settings.checkForMalformedBubbles || settings.onlyBubbleTheseWords) {
            return _this.looseCopyBubbled.apply(_this, arguments);
          } else {
            return _this.strictCopyBubbled.apply(_this, arguments);
          }
        };
        this.copySize = function() {
          var $from, $to, h, to, w, _ref2;
          $from = arguments[0], to = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          _ref2 = [$from.height(), $from.width()], h = _ref2[0], w = _ref2[1];
          $to = $(to);
          $to.height(h);
          return $to.width(w);
        };
        this.copyScroll = function(from, to) {
          return to.scrollTop = from.scrollTop;
        };
        return this.each(function(i, textarea) {
          var $mask, $source, $unit, scrollSoon;
          $source = $(textarea).addClass(settings.sourceClassName);
          $unit = $('<div></div>').addClass(settings.wrapperClassName);
          $source.before($unit).detach().appendTo($unit);
          $mask = $('<div></div>').addClass(settings.maskClassName).appendTo($unit);
          _this.copyBubbled($source, $mask);
          _this.copyCssProperties($source, $mask);
          $mask.css({
            'white-space': 'pre-wrap'
          });
          _this.copySize($source, $mask, $unit);
          $source.focus(function() {
            return $source.css({
              opacity: 1.0
            });
          });
          $source.blur(function() {
            return $source.css({
              opacity: 0.0
            });
          });
          $source.bind('blur change', function() {
            _this.copyBubbled($source, $mask);
            _this.copySize($source, $mask, $unit);
            return _this.copyScroll($source[0], $mask[0]);
          });
          scrollSoon = _.throttle((function() {
            return _this.copyScroll($source[0], $mask[0]);
          }), 20);
          $source.bind('scroll', scrollSoon);
          if ($source.is(":focus")) {
            return $source.focus();
          } else {
            return $source.blur();
          }
        });
      }
    });
    return $(function() {
      return $('.bubbling').bubble({
        checkForMalformedBubbles: true,
        matchAllowedWordsCaseSensitively: true,
        onlyBubbleTheseWords: 'InputHere Date Time Location'.split(' ')
      });
    });
  })(jQuery);

}).call(this);
