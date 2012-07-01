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

  jTag = {

    listeners: {
      imageListener: function(image){

        image.on('click', function(event){

          /* add window if tagging is enabled and if no window allready present */
          if(image.data('options').canTag && image.data('currentlyjTagging') == false ){

            image.data('currentlyjTagging', true);
            image.css('opacity', 0.3);

            var tagWindow = jTag.domMethods.createTagWindow(image);
            image.parent().data('tagWindow', tagWindow)
                          .data('currentlyjTagging', true);


            jTag.privateMethods.positionTagWindow(tagWindow, event);

          } else if(image.data('currentlyjTagging') == true){

            jTag.privateMethods.positionTagWindow(image.parent().find('.jTagTagWindow'), event);

          }

        });

      },

      tagWindow: function(){

        $(document).on('mousemove', '.jTagImageContainer', function(event){

          event.preventDefault();

          if($(this).data('currentlyjTagging') == true){
          
            var tagWindow = $(this).data('tagWindow');
            
            if(tagWindow.data('mousedown') == true){
              jTag.privateMethods.positionTagWindow(tagWindow, event);
            }

          }

          if($(this).data('jTagResizing') != false){
            //find cursor position relative to the container
            container_offset = $(this).offset();
            var tagWindow = $(this).data('tagWindow');
            
            x = event.pageX - container_offset.left;
            y = event.pageY - container_offset.top;

            desired_width =  x - parseInt(tagWindow.css('left'),10);
            desired_height = y - parseInt(tagWindow.css('top'),10);

            //handle minwidth & height
            if( $(this).data('options').minWidth != null )
            {
              desired_width = Math.max(desired_width, $(this).data('options').minWidth);
            } else {
              desired_width = Math.max(desired_width, 1);
            }

            if( $(this).data('options').minHeight != null )
            {
              desired_height = Math.max(desired_height, $(this).data('options').minHeight);
            } else {
               desired_height = Math.max(desired_height, 1);
            }

            //handle maxwidth & height
            if( $(this).data('options').maxWidth != null )
            {
              desired_width = Math.min(desired_width, $(this).data('options').maxWidth);
            }

            if( $(this).data('options').maxHeight != null )
            {
              desired_height = Math.min(desired_height, $(this).data('options').maxHeight);
            }

            //handle image constraint

            tagWindow.css('width', desired_width +"px");
            tagWindow.css('height', desired_height +"px");
          }

        });

        $(document).on('mouseleave',".jTagImageContainer", function(event){
    
          event.preventDefault();

          if($(this).data('currentlyjTagging') == true){

            var tagWindow = $(this).data('tagWindow');
            
            if(tagWindow.data('mousedown') == true){
              tagWindow.css('cursor', 'auto');
              tagWindow.data('mousedown', false);
            }

          }
        
        });

        $(document).on('mousedown','.jTagTagWindow', function(event){
          
          event.preventDefault();
          $(this).css('cursor', 'move');
          $(this).data('mousedown', true)
        
        });

        $(document).on('mouseup',".jTagTagWindow", function(event){
        
          event.preventDefault();
          $(this).css('cursor', 'auto');
          $(this).data('mousedown', false)
        
        });

      },

      handles: function(){

        $(document).on('mouseup',".jTagImageContainer", function(event){

          $(this).data('jTagResizing',false)
          
        });

       $(document).on('mousedown', '.jTagHandle', function(event){
          event.preventDefault();
          event.stopPropagation();
          $(this).parent().parent().data('jTagResizing', true);
       });

      }
    },

    domMethods: {

      createTagWindow: function(image){

        var offset = image.offset();
        var container = image.parent();

        var tagWindow = $("<div class='jTagTagWindow'></div>").css('width', image.data('options').defaultWidth)
                                                                  .css('height', image.data('options').defaultHeight)
                                                                  .css('background-image', 'url('+image.attr('src') +') ')
                                                                  .data("offset", offset)
                                                                  .data("imageWidth", image.width())
                                                                  .data("imageHeight", image.height())
                                                                  .appendTo(container);

        $("<div class='jTagHandle'></div>").appendTo(tagWindow);

        return tagWindow;

      }

    },

    privateMethods: {

      setupWrappers: function(image){

        var container = $("<div class='jTagImageContainer'></div>").css('width', image.width())
                                                                  .css('height', image.height())
                                                                  .data("options", image.data('options'))
                                                                  .data('jTagResizing', false);

         image.wrap(container);

      },

      setupListeners: function(image){

        jTag.listeners.imageListener(image);
        jTag.listeners.tagWindow();
        jTag.listeners.handles();
        

      },

      positionTagWindow: function(tagWindow, event){

        window_x = Math.min( Math.max( (event.pageX - tagWindow.data('offset').left) - tagWindow.outerWidth() / 2,0), (tagWindow.data('imageWidth') - tagWindow.outerWidth()));
        window_y = Math.min( Math.max( (event.pageY - tagWindow.data('offset').top ) - tagWindow.outerHeight() / 2, 0), (tagWindow.data('imageHeight') - tagWindow.outerHeight()));

        image_position_x = tagWindow.data('imageWidth') - window_x - parseInt(tagWindow.css('border-left-width'), 10);
        image_position_y = tagWindow.data('imageHeight') - window_y - parseInt(tagWindow.css('border-top-width'), 10);

        tagWindow.css('top', window_y)
                  .css('left', window_x)
                  .css('background-position',  image_position_x+"px " + image_position_y+"px");

      }

    }

  }
	
	$.extend($.fn,{

		jTag: function(custom_options) {

			var defaults = {
				minWidth      : 100,
				minHeight     : 100,
				defaultWidth  : 100,
				defaultHeight : 100,
				maxHeight     : null,
				maxWidth      : null,
				save          : null,
				remove        : null,
				canTag        : true,
				canDelete     : true,
				autoShowDrag  : false,
				autoComplete  : null,
				defaultTags   : null,
				clickToTag    : true,
				draggable     : true,
				resizable     : true,
				showTag       : 'hover',
				showLabels    : true,
				debug         : false,
        clickable     : false,
        click         : null
			};
			
			options = $.extend(defaults, custom_options);  

			return this.each(function() {
				
				var image = $(this);
        image.data('options', options);
        image.data('currentlyjTagging', false);

        jTag.privateMethods.setupWrappers(image);
        jTag.privateMethods.setupListeners(image);

      });
				
			
		}

	});
})(jQuery);
