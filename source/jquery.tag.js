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

    privateMethods: {

      setupWrappers: function(image){

        var container = $("<div class='jTagImageContainer'></div>").css('width', image.width())
                                                              .css('height', image.height());

         image.wrap(container);

      },

      setupListeners: function(image){

        image.on('click', function(event){

          /* add window if tagging is enabled and if no window allready present */
          if(image.data('options').canTag && image.data('currentlyjTagging') == false ){

            var offset = image.offset();
            var container = image.parent();

            image.data('currentlyjTagging', true);
            image.css('opacity', 0.3);

            var tagWindow = $("<div class='jTagTagWindow'></div>").css('width', image.data('options').defaultWidth)
                                                                  .css('height', image.data('options').defaultHeight)
                                                                  .css('background-image', 'url('+image.attr('src') +') ')
                                                                  .appendTo(container);

            $("<div class='jTagTopLeftHandle'></div>").appendTo(tagWindow);
            $("<div class='jTagTopRightHandle'></div>").appendTo(tagWindow);
            $("<div class='jTagTopMiddleHandle'></div>").appendTo(tagWindow);

            $("<div class='jTagMiddleRightHandle'></div>").appendTo(tagWindow);
            $("<div class='jTagMiddleLeftHandle'></div>").appendTo(tagWindow);

            
            $("<div class='jTagBottomLeftHandle'></div>").appendTo(tagWindow);
            $("<div class='jTagBottomRightHandle'></div>").appendTo(tagWindow);
            $("<div class='jTagBottomMiddleHandle'></div>").appendTo(tagWindow);

            tagWindow.data("offset", offset);
            tagWindow.data("imageWidth", image.width());
            tagWindow.data("imageHeight", image.height());


            jTag.privateMethods.positionTagWindow(tagWindow, event);

            tagWindow.on('mousemove', function(event){
              if($(this).data('mousedown') == true){

                jTag.privateMethods.positionTagWindow(tagWindow, event);

              }
            });

            tagWindow.on('mousedown', function(event){
              event.preventDefault();
              $(this).css('cursor', 'move');
              $(this).data('mousedown', true)
            });

            tagWindow.on('mouseup', function(event){
              event.preventDefault();
              $(this).css('cursor', 'auto');
              $(this).data('mousedown', false)
            });

          } else if(image.data('currentlyjTagging') == true){

            jTag.privateMethods.positionTagWindow(image.parent().find('.jTagTagWindow'), event);

          }

        });

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
