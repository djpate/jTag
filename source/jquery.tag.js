(function($){
	
	$.extend($.fn,{
		tag: function(options) {

			var defaults = {
				minWidth: 100,
				minHeight : 100,
				defaultWidth : 100,
				defaultHeight: 100,
				canDelete: true,
				maxHeight : null,
				maxWidth : null,
				save : null,
				remove: null,
				autoShowDrag: false,
				autoComplete: null,
				defaultTags: null,
				opacity: .4,
				clickToTag: true
			};
			
			var options = $.extend(defaults, options);  

			return this.each(function() {
				
				var obj = $(this);
				
				obj.data("options",options);
				
				obj.wrap('<div class="jTagArea" />');
				
				$(this).parent().width(obj.width());
				$(this).parent().height(obj.height());
				
				if(options.autoShowDrag){
					obj.showDrag();
				}
				
				$(".jTagTag").live('hover',function(){
					if($(".jTagDrag").length==0){
						$(this).css({opacity: 1});
						obj.parent().unbind('mousedown');
					}
				});
				
				$(".jTagTag").live('mouseleave',function(){
					if($(".jTagDrag").length==0){
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
		},
		hideDrag: function(){
			obj = $(this);
			
			var options = obj.data('options');
			
			obj.css({opacity: 1});
			
			obj.siblings(".jTagDrag").remove();
			
			$(".jTagTag",obj).show();
			
			obj.enableClickToTag();
			
		},
		showDrag: function(e){

			obj = $(this);
			
			obj.parent().unbind('mousedown');
			
			var options = obj.data('options');
			
			var position = function(){
				border = parseInt($(".jTagDrag").css('borderTopWidth'));
				left = parseInt($(".jTagDrag").attr('offsetLeft')) + border;
				top = parseInt($(".jTagDrag").attr('offsetTop')) + border;
				return "-"+left+"px -"+top+"px";
			}
			
			if(obj.siblings(".jTagDrag").length==1){
				alert("You're allready tagging someone");
				return;
			}
			
			obj.css({opacity: options.opacity });
					
			$('<div class="jTagDrag"><div class="jTagSave"><div class="jTagInput"><input type="text" id="jTagLabel"></div><div class="jTagSaveClose"></div><div class="jTagSaveBtn"></div><div style="clear:both"></div></div>').insertAfter(obj);
			
			$(".jTagDrag").css("backgroundImage","url("+obj.attr('src')+")");
			
			if(e){
				x = e.pageX - obj.attr('offsetLeft');
				y = e.pageY - obj.attr('offsetTop');
				
				if(x + $(".jTagDrag").width() > obj.parent().width()){
					x = obj.parent().width() - $(".jTagDrag").width() - 2;
				}
				
				if(y + $(".jTagDrag").height() > obj.parent().height()){
					y = obj.parent().height() - $(".jTagDrag").height() - 2;
				}
				
				$(".jTagDrag").css("top",y);
				$(".jTagDrag").css("left",x);
				$(".jTagDrag").css({backgroundPosition: position()});
			}
			
			
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
				top = $(this).parent().parent().attr('offsetTop');
				left = $(this).parent().parent().attr('offsetLeft');
				
				tagobj = obj.addTag(width,height,top,left,label);
				
				if(options.save){
					options.save(width,height,top,left,label,tag);
				}
				
			});
			
			$(".jTagSaveClose").click(function(){
				obj.hideDrag();
			});
			
			$(".jTagDrag").resizable({
				containment: 'parent',
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
				containment: 'parent',
				drag: function(){
					$(".jTagDrag").css({backgroundPosition: position()});
				},
				stop: function(){
					$(".jTagDrag").css({backgroundPosition: position()});
				}
			});
		},
		addTag: function(width,height,top,left,label,id){
			
			obj = $(this);
			
			obj.css({opacity: 1});
			
			var options = obj.data('options');
			
			tag = $('<div class="jTagTag" style="width:'+width+'px;height:'+height+'px;top:'+top+'px;left:'+left+'px;"><div class="jTagDeleteTag"></div><span>'+label+'</span></div>')
						.insertAfter(obj);
			
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
		}
	});
})(jQuery);
