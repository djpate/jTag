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
				autoCompleteValues: null
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
				
			});
		},
		hideDrag: function(){
			obj = $(this);
			
			obj.siblings(".jTagDrag").remove();
			$(".jTagTag",obj).show();
			
		},
		showDrag: function(){
		
			obj = $(this);
			
			var options = obj.data('options');
			
			if(obj.siblings(".jTagDrag").length==1){
				alert("You're allready tagging someone");
				return;
			}
			
			$(".jTagTag",obj.parent()).hide();
					
			$('<div class="jTagDrag"><div class="jTagSave"><div class="jTagInput"><input type="text"></div><div class="jTagSaveClose"></div><div class="jTagSaveBtn"></div><div style="clear:both"></div></div>').insertAfter(obj);
			
			if(options.autoCompleteValues){
				input = $(".jTagInput input").autocomplete({
					
				});
			}
			
			$(".jTagSaveBtn").click(function(){
				
				label = $(this).prev().prev().find("input").val();
				
				if(label==''){
					alert('The label cannot be empty');
					return;
				}
				
				height = $(this).parent().parent().height();
				width = $(this).parent().parent().width();
				top = $(this).parent().parent().attr('offsetTop');
				left = $(this).parent().parent().attr('offsetLeft');
				
				obj.addTag(width,height,top,left,label);
				
				if(options.save){
					options.save(width,height,top,left,label);
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
				maxHeight: options.maxHeight
			
			});
		
			$(".jTagDrag").draggable({
				containment: 'parent'
			});
		},
		addTag: function(width,height,top,left,label,id){
			
			obj = $(this);
			
			var options = obj.data('options');
			
			$(".jTagTag",obj.parent()).show();
			
			$('<div class="jTagTag" style="width:'+width+'px;height:'+height+'px;top:'+top+'px;left:'+left+'px;"><div class="jTagDeleteTag"></div><span>'+label+'</span></div>').insertAfter(obj).data('id',id);
			
			if(options.canDelete){
				$('.jTagDeleteTag',obj.parent()).show();
				
				$('.jTagDeleteTag').click(function(){
					$(this).parent().remove();
					
					if(options.remove){
						options.remove.call($(this).data('id'));
					}
					
				});
			
			}
			
			obj.siblings(".jTagDrag").remove();
			
		}
	});
})(jQuery);
