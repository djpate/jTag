(function($){
	
	$.extend($.fn,{
		tag: function(options) {

			var defaults = {
				minWidth: 100,
				minHeight : 100,
				defaultWidth : 100,
				defaultHeight: 100,
				canDelete: false,
				maxHeight : null,
				maxWidth : null,
				save : null,
				remove: null,
				autoShowDrag: false,
				autoComplete: null,
				defaultTags: null,
				opacity: 0.4,
				clickToTag: true
			};
			
			var options = $.extend(defaults, options);  

			return this.each(function() {
				
				var obj = $(this);
				
				obj.data("options",options);
				
				/* we need to wait for load because we need the img to be fully loaded to get proper width & height */
				$(window).load(function(){
					
					obj.wrap('<div class="jTagArea" />');
					
					$('<div class="jTagOverlay"></div>').insertBefore(obj);
					
					obj.parent().css("backgroundImage","url("+obj.attr('src')+")");
					
					obj.parent().width(obj.width());
					obj.parent().height(obj.height());
					
					obj.hide();
					
					if(options.autoShowDrag){
						obj.showDrag();
					}
				
					$(".jTagTag").live('hover',function(){
						if($(".jTagDrag").length===0){
							$(this).css({opacity: 1});
							obj.disableClickToTag();
						}
					});
					
					$(".jTagTag").live('mouseleave',function(){
						if($(".jTagDrag").length===0){
							$(this).css({opacity: 0});
							obj.enableClickToTag();
						}
					});
					
					if(options.canDelete){
					
						$('.jTagDeleteTag').live('click',function(){
							
							if(options.remove){
								options.remove($(this).parent().getId());
							}
							
							obj.enableClickToTag();
							
							$(this).parent().remove();
							
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
			
			$(".jTagOverlay").css("backgroundColor","");
			$(".jTagOverlay").css("backgroundUrl","");
			
			$(".jTagDrag").remove();
			
			$(".jTagTag").show();
			
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
				alert("You're allready tagging someone");
				return;
			}
					
			$('<div class="jTagDrag"><div class="jTagSave"><div class="jTagInput"><input type="text" id="jTagLabel"></div><div class="jTagSaveClose"></div><div class="jTagSaveBtn"></div><div style="clear:both"></div></div>').appendTo($(".jTagOverlay"));
			
			$(".jTagOverlay").css("backgroundColor","rgba(200, 54, 54, 0.5)");
			$(".jTagOverlay").css("backgroundUrl","url(images/trans.png)");
			
			
			$(".jTagDrag").css("backgroundImage","url("+obj.attr('src')+")");
			
			if(e){
				x = e.pageX - obj.parent().attr('offsetLeft');
				y = e.pageY - obj.parent().attr('offsetTop');
				
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
					options.save(width,height,top_pos,left,label,tag);
				}
				
			});
			
			$(".jTagSaveClose").click(function(){
				obj.hideDrag();
			});
			
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
		
			$(".jTagDrag").draggable({
				containment: obj.parent(),
				drag: function(){
					$(".jTagDrag").css({backgroundPosition: position()});
				},
				stop: function(){
					$(".jTagDrag").css({backgroundPosition: position()});
				}
			});
			
			$(".jTagDrag").css({backgroundPosition: position()});
		},
		addTag: function(width,height,top_pos,left,label,id){
			
			obj = $(this);
			
			obj.css({opacity: 1});
			
			var options = obj.data('options');
			
			tag = $('<div class="jTagTag" style="width:'+width+'px;height:'+height+'px;top:'+top_pos+'px;left:'+left+'px;"><div class="jTagDeleteTag"></div><span>'+label+'</span></div>')
						.appendTo($(".jTagOverlay"));
			
			if(id){
				tag.setId(id);
			}
			
			if(options.canDelete){
				obj.parent().find(".jTagDeleteTag").show();
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
