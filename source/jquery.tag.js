/*  This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.*/
(function($){
	
	$.extend($.fn,{
		tag: function(options) {

			var defaults = {
				minWidth: 100,
				minHeight : 100,
				defaultWidth : 100,
				defaultHeight: 100,
				maxHeight : null,
				maxWidth : null,
				save : null,
				remove: null,
				canTag: true,
				canDelete: true,
				autoShowDrag: false,
				autoComplete: null,
				defaultTags: null,
				clickToTag: true,
				draggable: true,
				resizable: true,
				showTag: 'hover',
				showLabels: true,
				debug: false
			};
			
			var options = $.extend(defaults, options);  

			return this.each(function() {
				
				var obj = $(this);
				
				obj.data("options",options);
				
				/* we need to wait for load because we need the img to be fully loaded to get proper width & height */
				$(window).load(function(){
					
					obj.wrap('<div class="jTagContainer" />');
					
					obj.wrap('<div class="jTagArea" />');
					
					$("<div class='jTagLabels'><div style='clear:both'></div></div>").insertAfter(obj.parent());
					
					$('<div class="jTagOverlay"></div>').insertBefore(obj);
					
					var container = obj.parent().parent();
					var overlay = obj.prev();
					
					obj.parent().css("backgroundImage","url("+obj.attr('src')+")");
					
					obj.parent().width(obj.width());
					obj.parent().height(obj.height());
					
					obj.parent().parent().width(obj.width());
					
					obj.hide();
					
					if(options.autoShowDrag){
						obj.showDrag();
					}
				
					container.delegate('.jTagTag','mouseenter',function(){
						if($(".jTagDrag",container).length==0){
							$(this).css("opacity",1);
							$(".jTagDeleteTag",this).show();
							$(this).find("span").show();
							obj.disableClickToTag();
						}
					});
					
					container.delegate('.jTagTag','mouseleave',function(){
						if($(".jTagDrag",container).length==0){
							if(options.showTag == 'hover'){
								$(this).css("opacity",0);
								$(".jTagDeleteTag",this).hide();
								$(this).find("span").hide();
							}
							obj.enableClickToTag();
						}
					});
					
					if(options.showLabels && options.showTag != 'always'){
					
						container.delegate('.jTagLabels label','mouseenter',function(){
							$("#"+$(this).attr('rel')).css('opacity',1).find("span").show();
							$(".jTagDeleteTag",container).show();
						});
						
						container.delegate('.jTagLabels label','mouseleave',function(){
							$("#"+$(this).attr('rel')).css('opacity',0).find("span").hide();
							$(".jTagDeleteTag",container).hide();
							
						});
					
					}
					
					if(options.canDelete){
					
						container.delegate('.jTagDeleteTag','click',function(){
							
							/* launch callback */
							if(options.remove){
								options.remove($(this).parent().parent().getId());
							}
							
							/* remove the label */
							if(options.showLabels){
								$(".jTagLabels",container).find('label[rel="'+$(this).parent().parent().attr('id')+'"]').remove();
							}
							
							/* remove the actual tag from dom */
							$(this).parent().parent().remove();
							
							obj.enableClickToTag();
							
						});
					
					}
					
					if(options.defaultTags){
						$.each(options.defaultTags, function (index,value){
							obj.addTag(value.width,value.height,value.top,value.left,value.label,value.id);
						});
					}
					
					obj.enableClickToTag();
						
				});
			
			});
		},
		hideDrag: function(){
			var obj = $(this);
			
			var options = obj.data('options');
			
			obj.prev().removeClass("jTagPngOverlay");
			
			obj.parent().parent().find(".jTagDrag").remove();
			
			if(options.showTag == 'always'){
				obj.parent().parent().find(".jTagTag").show();
			}
			
			obj.enableClickToTag();
			
		},
		showDrag: function(e){

			var obj = $(this);
			
			var container = obj.parent().parent();
			var overlay = obj.prev();
			
			obj.disableClickToTag();
			
			var options = obj.data('options');
			
			var position = function(context){
				var jtagdrag = $(".jTagDrag",context);
				border =   parseInt(jtagdrag.css('borderTopWidth'));
				left_pos = parseInt(jtagdrag.attr('offsetLeft')) + border;
				top_pos =  parseInt(jtagdrag.attr('offsetTop')) + border;
				return "-"+left_pos+"px -"+top_pos+"px";
			}
			
			if($(".jTagDrag",overlay).length==1){
				return;
			}
			
			if(!options.canTag){
				return;
			}
			
			if(options.showTag == 'always'){
				$(".jTagTag",overlay).hide();
			}
					
			$('<div style="width:'+options.defaultWidth+'px;height:'+options.defaultHeight+'px"class="jTagDrag"><div class="jTagSave"><div class="jTagInput"><input type="text" id="jTagLabel"></div><div class="jTagSaveClose"></div><div class="jTagSaveBtn"></div><div style="clear:both"></div></div>').appendTo(overlay);
			
			overlay.addClass("jTagPngOverlay");
			
			jtagdrag = $(".jTagDrag",overlay);
			
			jtagdrag.css("backgroundImage","url("+obj.attr('src')+")");
			
			if(e){
				
				function findPos(someObj){
					var curleft = curtop = 0;
					if (someObj.offsetParent) {
						do {
							curleft += someObj.offsetLeft;
							curtop += someObj.offsetTop;
						} while (someObj = someObj.offsetParent);
						return [curleft,curtop];
					}
				}
				
				/* get real offset */
				pos = findPos(obj.parent()[0]);
				
				x = Math.max(0,e.pageX - pos[0] - (options.defaultWidth / 2));
				y = Math.max(0,e.pageY - pos[1] - (options.defaultHeight / 2));
				
				if(x + jtagdrag.width() > obj.parent().width()){
					x = obj.parent().width() - jtagdrag.width() - 2;
				}
				
			
				
				if(y + jtagdrag.height() > obj.parent().height()){
					y = obj.parent().height() - jtagdrag.height() - 2;
				}

			} else {
				
				x = 0;
				y = 0;
				
			}
			
			jtagdrag.css("top",y)
						  .css("left",x);
			
			
			if(options.autoComplete){
				$("#jTagLabel",container).autocomplete({
					source: options.autoComplete
				});
			}
			
			$(".jTagSaveBtn",container).click(function(){
				
				label = $("#jTagLabel",container).val();
				
				if(label==''){
					alert('The label cannot be empty');
					return;
				}
				
				height = $(this).parent().parent().height();
				width = $(this).parent().parent().width();
				top_pos = $(this).parent().parent().attr('offsetTop');
				left = $(this).parent().parent().attr('offsetLeft');
				
				tagobj = obj.addTag(width,height,top_pos,left,label);
				
				if(options.save){
					options.save(width,height,top_pos,left,label,tagobj);
				}
				
			});
			
			$(".jTagSaveClose",container).click(function(){
				obj.hideDrag();
			});
			
			if(options.resizable){
			
				jtagdrag.resizable({
					containment: obj.parent(),
					minWidth: options.minWidth,
					minHeight: options.minHeight,
					maxWidht: options.maxWidth,
					maxHeight: options.maxHeight,
					resize: function(){
						jtagdrag.css({backgroundPosition: position(overlay)});
					},
					stop: function(){
						jtagdrag.css({backgroundPosition: position(overlay)});
					}
				});
			
			}
		
			if(options.draggable){
		
				jtagdrag.draggable({
					containment: obj.parent(),
					drag: function(){
						jtagdrag.css({backgroundPosition: position(overlay)});
					},
					stop: function(){
						jtagdrag.css({backgroundPosition: position(overlay)});
					}
				});
			
			}
			
			jtagdrag.css({backgroundPosition: position(overlay)});
		},
		addTag: function(width,height,top_pos,left,label,id){
			
			var obj = $(this);
			
			var options = obj.data('options');
			var count = $(".jTagTag").length+1;
			
			tag = $('<div class="jTagTag" id="tag'+count+'"style="width:'+width+'px;height:'+height+'px;top:'+top_pos+'px;left:'+left+'px;"><div style="width:100%;height:100%"><div class="jTagDeleteTag"></div><span>'+label+'</span></div></div>')
						.appendTo(obj.prev());
			
			if(id){
				tag.setId(id);
			}
			
			if(options.canDelete){
				obj.parent().find(".jTagDeleteTag").show();
			}
			
			if(options.showTag == "always"){
				$(".jTagTag").css("opacity",1);
			}
			
			if(options.showLabels){
				$("<label rel='tag"+count+"'>"+label+"</label>").insertBefore($(".jTagLabels div:last"));
			}
			
			obj.hideDrag();
			
			return tag;
			
		},
		setId: function(id){
			if($(this).hasClass("jTagTag")){
				$(this).data("tagid",id);
			} else {
				alert('Wrong object');
			}
		},
		getId: function(id){
			if($(this).hasClass("jTagTag")){
				return $(this).data("tagid");
			} else {
				alert('Wrong object');
			}
		},
		enableClickToTag: function(){
			
			var obj = $(this);
			var options = obj.data('options');
			
			if(options.clickToTag){
				
				obj.parent().mousedown(function(e){
					obj.showDrag(e);
					obj.parent().unbind('mousedown');
				});
			}
		},
		disableClickToTag: function(){
			
			var obj = $(this);
			var options = obj.data('options');
			
			if(options.clickToTag){
				obj.parent().unbind('mousedown');
			}
		}
	});
})(jQuery);
