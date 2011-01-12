(function($){
	
	$.fn.tag = function(options) {

		var defaults = {
			saveLabel: "Save",
			minWidth: 100,
			minHeight : 100,
			defaultWidth : 100,
			defaultHeight: 100,
			maxHeight : null,
			maxWidth : null,
			save : null,
			autoShowDrag: true
		};
		
		var options = $.extend(defaults, options);  

		return this.each(function() {
			
			var obj = $(this);
			
			var addTag = function(width,height,top,left){
				/* reset the drag box */
				if(options.autoShowDrag){
					obj.siblings(".jTagDrag").animate({
						top: 0,
						left: 0,
						width: options.defaultWidth,
						height: options.defaultHeight
					},1000);
				} else {
					obj.siblings(".jTagDrag").remove();
				}
				
				/* add the tag */
				$('<div class="jTagTag" style="width:'+width+'px;height:'+height+'px;top:'+top+'px;left:'+left+'px;"><span>a Tag</span></div>').insertAfter(obj);
			}
			
			var showDrag = function(){
				
				$(".jTagTag",obj).hide();
				
				$('<div class="jTagDrag"><div class="jTagSave">'+options.saveLabel+'</div></div>').insertAfter(obj);
				
				$(".jTagSave").click(function(){
				
					height = $(this).parent().height();
					width = $(this).parent().width();
					top = $(this).parent().attr('offsetTop');
					left = $(this).parent().attr('offsetLeft');
					
					addTag(width,height,top,left);
					
					if(options.save){
						options.save(width,height,top,left);
					}
					
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
				
			}
			
			obj.wrap('<div class="jTagArea" />');
			
			$(this).parent().width(obj.width());
			$(this).parent().height(obj.height());
			
			if(options.autoShowDrag){
				showDrag();
			}
			
		});
		
	};
})(jQuery);
