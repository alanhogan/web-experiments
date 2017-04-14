	// 
					
					var childNodes = this.childNodes,
					i = childNodes.length;
					while ( i-- )
					{
						var n = childNodes[i];
						if ( n.nodeType == 3 )
						{
							var html = n.nodeValue;
							if ( html.length>1  &&  /\S/.test(html) )
							{
								var htmlChanged,
								preHtml;
								tmpCont = tmpCont || $('<div/>')[0];
								tmpCont.innerHTML = '';
								tmpCont.appendChild( n.cloneNode(false) );
								var tmpContNodes = tmpCont.childNodes;

								for (var j=0, plugin; (plugin = plugins[j]); j++)
								{
									var k = tmpContNodes.length,
									tmpNode;
									while ( k-- )
									{
										tmpNode = tmpContNodes[k];
										if ( tmpNode.nodeType == 3 )
										{
											html = tmpNode.nodeValue;
											if ( html.length>1  &&  /\S/.test(html) )
											{
												preHtml = html;
												html = html
												          .replace( /&/g, '&amp;' )
												          .replace( /</g, '&lt;' )
												          .replace( />/g, '&gt;' );
												html = $.isFunction( plugin ) ? 
												            plugin( html ):
												            html.replace( plugin.re, plugin.tmpl );
												htmlChanged = htmlChanged || preHtml!=html;
												preHtml!=html  &&  $(tmpNode).after(html).remove();
											}
										}
									}
								}
								html = tmpCont.innerHTML;
								if ( callback )
								{
									html = $('<div/>').html(html);
									//newLinks.push.apply( newLinks,  html.find('a').toArray() );
									newLinks = newLinks.concat( html.find('a').toArray().reverse() );
									html = html.contents();
								}
								htmlChanged  &&  $(n).after(html).remove();
							}
						}
						else if ( n.nodeType == 1  &&  !/^(a|button|textarea)$/i.test(n.tagName) )
						{
							arguments.callee.call( n );
						}
					};
					
					//