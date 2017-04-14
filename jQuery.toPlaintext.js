/*
 * Alan Hogan, 2011
 * Turns HTML into plaintext.
 * 
 * Note that unlike some systems we don't assume that <p>foo</p><p>bar</p> should have a blank line between
 * the paragraphs, in plaintext (they will of course be separated by a newline). 
 * 
 * opts.whiteSpace can only be 'pre' for now (equivalent to pre-wrap)
 * (other options could be supported in the future).
 * 
 * atBoundary is used for recursion (SPLIT?)
 * 
 */

jQuery.fn.toPlaintext = function(options){
  var opts = {
    whiteSpace: 'pre'
  }
  if(typeof options !== 'undefined') {
    jQuery.extend(opts, options);
  }
  var atBoundary;

  function processNodes(elem){
    $nodes = $(elem).contents();
    var ret = '';
    
    $nodes.each(function(){
      switch(this.nodeType) {
        case 1: //Node.ELEMENT_NODE (Constant not defined in IE)
          switch(this.tagName.toLowerCase()) {
            case 'br':
              ret += "\n"; // No matter the whiteSpace mode.
              atBoundary = true;
              break; 
            case 'div': case 'p': case 'blockquote': 
            case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6':
              ret += blockLevelElement(this);
              break;
            case 'span': case 'a': case 'b': case 'i': case 'em': case 'strong':
            case 'label': case 'button':  
              ret += inlineElement(this);
              break;
            default:
              window.console&&console.log('No explicit support for tag type '+
                this.tagName+'; treating as inline element');
              ret += inlineElement(this);
          } // end switch on tag name
          
          break;
          
        case 3: //Node.TEXT_NODE
          ret += $(this).text();
          atBoundary = false;
          break;
          
        default: 
          window.console&&console.log('encountered node type '+this.nodeType);
          break;
      } // End switch on node type
    }); // loop over $nodes
    
    return ret;
  };

  function inlineElement(elem){
    var ret = processNodes(elem);
    
    if (atBoundary && !ret.match(/^\s+$/m)) {
      // This element contained the first characters of a line, so we aren’t anymore.
      atBoundary = false;
    } else {
      // correct
    }
    return ret;
  };

  function blockLevelElement(elem) {
    var ret = '';
    
    // My opening signifies a block begins and thus my content needs to start on its own line.
    if (atBoundary) {
      // No need to echo a newline
    } else {
      atBoundary = true;
      ret += "\n";
    }
    
    // Process my children:
    ret += processNodes(elem);
    
    // My closing signifies a block is ending and thus whatever follows needs to start on its own line.
    if (atBoundary) {
      // No need to echo a newline
    } else {
      atBoundary = true;
      ret += "\n"; // technically this is incorrect if I am the last thing and nothing follows
    }
    return ret;
  };
  
  var $me = $(this);
  if ($me.length == 0) { return null; }
  if ($me.length > 1) {
    window.console&&console.log('jQuery.toPlaintext should only be called '+
      'on collections of one node (was a collection of ' + $me.length + 
      'nodes. Returning contents of only the first node.)');
  }
  return processNodes($me[0]);
};