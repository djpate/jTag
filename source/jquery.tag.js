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
					
					$("<div class='jTagLabels' />").insertAfter($(".jTagArea"));
					
					$('<div class="jTagOverlay"></div>').insertBefore(obj);
					
					obj.parent().css("backgroundImage","url("+obj.attr('src')+")");
					
					obj.parent().width(obj.width());
					obj.parent().height(obj.height());
					
					obj.parent().parent().width(obj.width());
					
					obj.hide();
					
					if(options.autoShowDrag){
						obj.showDrag();
					}
				
					$(".jTagTag").live('mouseenter',function(){
						if($(".jTagDrag").length==0){
							$(this).css("opacity",1);
							$(this).find("span").show();
							obj.disableClickToTag();
						}
					});
					
					$(".jTagTag").live('mouseleave',function(){
						if($(".jTagDrag").length==0){
							if(options.showTag == 'hover'){
								$(this).css("opacity",0);
								$(this).find("span").hide();
							}
							obj.enableClickToTag();
						}
					});
					
					if(options.showLabels && options.showTag != 'always'){
					
						$(".jTagLabels label").live('mouseenter',function(){
							$("#"+$(this).attr('rel')).css('opacity',1).find("span").show();
						});
						
						$(".jTagLabels label").live('mouseleave',function(){
							$("#"+$(this).attr('rel')).css('opacity',0).find("span").hide();
							
						});
					
					}
					
					if(options.canDelete){
					
						$('.jTagDeleteTag').live('click',function(){
							
							if(options.remove){
								options.remove($(this).parent().parent().getId());
							}
							
							obj.enableClickToTag();
							
							$(this).parent().parent().remove();
							
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
			obj = $(this);
			
			var options = obj.data('options');
			
			$(".jTagOverlay").removeClass("jTagPngOverlay");
			
			$(".jTagDrag").remove();
			
			if(options.showTag == 'always'){
				$(".jTagTag").show();
			}
			
			obj.enableClickToTag();
			
		},
		showDrag: function(e){

			obj = $(this);
			
			obj.disableClickToTag();
			
			var options = obj.data('options');
			
			var position = function(){
				border = parseInt($(".jTagDrag").css('borderTopWidth'));
				left_pos = parseInt($(".jTagDrag").attr('offsetLeft')) + border;
				top_pos = parseInt($(".jTagDrag").attr('offsetTop')) + border;
				return "-"+left_pos+"px -"+top_pos+"px";
			}
			
			if($(".jTagDrag").length==1){
				return;
			}
			
			if(!options.canTag){
				return;
			}
			
			if(options.showTag == 'always'){
				$(".jTagTag").hide();
			}
					
			$('<div style="width:'+options.defaultWidth+'px;height:'+options.defaultHeight+'px"class="jTagDrag"><div class="jTagSave"><div class="jTagInput"><input type="text" id="jTagLabel"></div><div class="jTagSaveClose"></div><div class="jTagSaveBtn"></div><div style="clear:both"></div></div>').appendTo($(".jTagOverlay"));
			
			$(".jTagOverlay").addClass("jTagPngOverlay");
			
			$(".jTagDrag").css("backgroundImage","url("+obj.attr('src')+")");
			
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
				
				if(x + $(".jTagDrag").width() > obj.parent().width()){
					x = obj.parent().width() - $(".jTagDrag").width() - 2;
				}
				
			
				
				if(y + $(".jTagDrag").height() > obj.parent().height()){
					y = obj.parent().height() - $(".jTagDrag").height() - 2;
				}

			} else {
				
				x = 0;
				y = 0;
				
			}
			
			$(".jTagDrag").css("top",y)
						  .css("left",x);
			
			
			if(options.autoComplete){
				$("#jTagLabel").autocomplete({
					source: options.autoComplete
				});
			}
			
			$(".jTagSaveBtn").click(function(){
				
				label = $("#jTagLabel").val();
				
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
			
			$(".jTagSaveClose").click(function(){
				obj.hideDrag();
			});
			
			if(options.resizable){
			
				$(".jTagDrag").resizable({
					containment: obj.parent(),
					minWidth: options.minWidth,
					minHeight: options.minHeight,
					maxWidht: options.maxWidth,
					maxHeight: options.maxHeight,
					resize: function(){
						$(".jTagDrag").css({backgroundPosition: position()});
					},
					stop: function(){
						$(".jTagDrag").css({backgroundPosition: position()});
					}
				});
			
			}
		
			if(options.draggable){
		
				$(".jTagDrag").draggable({
					containment: obj.parent(),
					drag: function(){
						$(".jTagDrag").css({backgroundPosition: position()});
					},
					stop: function(){
						$(".jTagDrag").css({backgroundPosition: position()});
					}
				});
			
			}
			
			$(".jTagDrag").css({backgroundPosition: position()});
		},
		addTag: function(width,height,top_pos,left,label,id){
			
			obj = $(this);
			
			var options = obj.data('options');
			
			tag = $('<div class="jTagTag" id="tag'+($(".jTagTag").length+1)+'"style="width:'+width+'px;height:'+height+'px;top:'+top_pos+'px;left:'+left+'px;"><div style="width:100%;height:100%"><div class="jTagDeleteTag"></div><span>'+label+'</span></div></div>')
						.appendTo($(".jTagOverlay"));
			
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
				$("<label rel='tag"+$(".jTagTag").length+"'>"+label+"</label>").appendTo($(".jTagLabels"));
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
			
			obj = $(this);
			var options = obj.data('options');
			
			if(options.clickToTag){
				
				obj.parent().mousedown(function(e){
					obj.showDrag(e);
					obj.parent().unbind('mousedown');
				});
			}
		},
		disableClickToTag: function(){
			
			obj = $(this);
			var options = obj.data('options');
			
			if(options.clickToTag){
				obj.parent().unbind('mousedown');
			}
		}
	});
})(jQuery);
