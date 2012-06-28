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


            window_x = Math.min( Math.max( (event.pageX - offset.left) - image.data('options').defaultWidth / 2,0), (image.width() - image.data('options').defaultWidth));
            window_y = Math.min( Math.max( (event.pageY - offset.top ) - image.data('options').defaultHeight / 2, 0), (image.height() - image.data('options').defaultHeight));

            var tagWindow = $("<div class='jTagTagWindow'></div>").css('width', image.data('options').defaultWidth)
                                                                  .css('height', image.data('options').defaultHeight)
                                                                  .css('top', window_y)
                                                                  .css('left', window_x)
                                                                  .appendTo(container);

            tagWindow.on('mousemove', function(event){
              if($(this).data('mousedown') == true){

                window_x = Math.min( Math.max( (event.pageX - offset.left) - image.data('options').defaultWidth / 2,0), (image.width() - image.data('options').defaultWidth));
                window_y = Math.min( Math.max( (event.pageY - offset.top ) - image.data('options').defaultHeight / 2, 0), (image.height() - image.data('options').defaultHeight));

                $(this).css('top', window_y)
                       .css('left', window_x);
              }
            });

            tagWindow.on('mousedown', function(){
              $(this).data('mousedown', true)
            });

            tagWindow.on('mouseup, mouseout', function(){
              $(this).data('mousedown', false)
            });

          }

        });

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
