jQuery.fn.extend( {
	cndceAccordion: function( params ){
		if( params == undefined )
			params = {};

		if( params.maxSegmentWidth == undefined )
			params.maxSegmentWidth = null;


		var accordion = this;

		var hasResized = false;

		var isVertical = $( this ).hasClass( 'vertical' );
		var handles;

		// Vertical orientation
		if( isVertical ){
			handles = 'n, s';
		}else{
			handles = 'e, w';
		}


		$( accordion ).addClass( 'cndce-accordion' );

		// Add jQuery UI Sortable Wrapper
		$( '.section', accordion ).each( function(  ){
			var $wrapper = $( '<div class="cndce-sortable"></div>' );

			$( this ).children(  ).appendTo( $wrapper );
			$( this ).append( $wrapper );

			$( this ).resizable( {
				handles: handles,
				maxWidth: params.maxSegmentWidth,
				stop: function( e, ui ){

					if( !isVertical ){
						var accordionWidth = $( accordion ).outerWidth(  );

						$( '.section', accordion ).each( function(  ){
							$( this ).css( 'width', ( ( $( this ).outerWidth(  ) / accordionWidth ) * 90 ) + '%' );

							$( this ).removeClass( 'ui-resizable-resizing' );

							
						} )
					}else{
						var accordionHeight = $( accordion ).outerHeight(  );

						$( '.section', accordion ).each( function(  ){
							$( this ).css( 'height', ( ( $( this ).outerHeight(  ) / accordionHeight ) * 90 ) + '%' );

							$( this ).removeClass( 'ui-resizable-resizing' );

							
						} )
					}

					
				},
				start: function( e, ui ){
					
				},
				resize: function( e, ui ){

					var $sections = $( '.section', accordion );

					var i = $sections.index( ui.element );
					var j = i;

					if( ui.element.data( 'ui-resizable' ).axis == 'e' ){
						j++;
					}else if( ui.element.data( 'ui-resizable' ).axis == 'w' ){
						j--;
					}else if( ui.element.data( 'ui-resizable' ).axis == 'n' ){
						j--;
					}else if( ui.element.data( 'ui-resizable' ).axis == 's' ){
						j++;
					}

					if( j >= 0 && j < $sections.length ){
						var $adjacent = $( $sections[j] );

						if( !isVertical ){
							var delta = ui.size.width - ui.originalSize.width;

							$adjacent.outerWidth( $adjacent.outerWidth(  ) - ( delta * 0.05 ) );
						}else{
							var delta = ui.size.height - ui.originalSize.height;

							$adjacent.outerHeight( $adjacent.outerHeight(  ) - ( delta * 0.05 ) );
						}
						

						$adjacent.addClass( 'ui-resizable-resizing' );
					}

                    var height;
                    $(this).find(".boundary").each(function(i, el){
                        if ($(el).attr("class").indexOf("left") > -1 || $(el).attr("class").indexOf("right") > -1) {
                            height = $(el).parent().innerHeight() - 3 * parseInt($(el).css("font-size")) - 20;
                            $(el).css("width", height);
                        }
                    });

                    $(this).find(".tagger-word").each(function(i, el){
                        $(el).css({
                            width: parseInt($(el).text().length / $(el).parent().text().length * 100) + "%",
                            "min-width": $(el).text().length * 0.55 + "em"
                        })
                    });

                    // console.log( ui );
				}

			} );

		} )




		// Add Pattern background
		$( '.section', accordion ).append( '<div class="pattern"></div>' );

		// Add Close Button
		$( '.section', accordion ).append( '<div class="close-btn"></div>' )


		// jQueryUI Sortable
		$( '.section .cndce-sortable', accordion ).each( function(  ){
			$( this ).sortable( {
				// containment: this,
				// items: '.cndce-draggable',
				cancel: '.cndce-undraggable, .cndce-free-draggable',
				connectWith: $( '.section .cndce-sortable', accordion )
			} )
			.disableSelection(  );
		} )


		// jQueryUI Draggable
		

		$( '.section .cndce-free-draggable', accordion ).each( function(  ){
			
			$( this ).draggable( {
				// snap: '.section .cndce-sortable',
				// snapMode: 'inner',
				// snapTolerance: $( this ).outerWidth(  )/3,
				grid: [30, 30],
				start: function(  ){
					$( accordion ).addClass( 'drag-start' );
				},
				stop: function(  ){
					$( accordion ).removeClass( 'drag-start' );
				}
			} );

		} );


		// jQueryUI Droppable
		$( '.section .cndce-sortable', accordion ).droppable( {
			// tolerance: 'fit',
			drop: function( event, ui ){

				var parentOffset = $( this ).offset(  );

				ui.draggable.css( {
					top: ui.offset.top - parentOffset.top,
					left: ui.offset.left - parentOffset.left
				} );

				$( this ).append( ui.draggable );

			}	
		} );


		$( '.section', accordion ).click( function( e ){

			if( !hasResized ){
				if( $( this ).hasClass( 'active' ) ){
					$( this ).removeClass( 'active' );
				}else{
					$( '.section.active', accordion ).removeClass( 'active' );
					$( this ).addClass( 'active' );
				}
			}

            var that = this, height;
            setTimeout(function(){
                $(that).find(".boundary").each(function(i, el){
                    if ($(el).attr("class").indexOf("left") > -1 || $(el).attr("class").indexOf("right") > -1) {
                        height = $(el).parent().innerHeight() - 3 * parseInt($(el).css("font-size")) - 20;
                        $(el).css("width", height);
                    }
                });

                $(that).find(".tagger-word").each(function(i, el){
                    $(el).css({
                        width: parseInt($(el).text().length / $(el).parent().text().length * 100) + "%",
                        "min-width": $(el).text().length * 0.55 + "em"
                    });
                });
            }, 500);

        } )


		// jQueryUI Resizable
		$( accordion ).mousemove( function(  ){
			if( $( '.section.ui-resizable-resizing', accordion ).length > 0 )
				hasResized = true;

		} )

		$( accordion ).mousedown( function(  ){
			hasResized = false;
		} )




		// Custom Events
		// $( '.cndce-sortable > *', accordion ).click( function( e ){
		// 	// e.stopPropagation(  );
		// } )

		$( '.cndce-sortable .cndce-draggable', accordion ).mousedown( function( e ){

			$( accordion ).addClass( 'drag-start' );
		} )

		$( '.cndce-sortable .cndce-draggable', accordion ).mouseup( function( e ){

			$( accordion ).removeClass( 'drag-start' );
		} )


		// Fix Mobile Scrolling

		var touchStartY = undefined;
		var isDragSelected = false;
		var isContainerScrolling = false;


		$( '.cndce-sortable' ).scroll( function( e ){
			isContainerScrolling = true;
		} );

		$( accordion ).on( 'touchstart', '.cndce-draggable, .cndce-free-draggable', function( e ){

			isDragSelected = true;


		} )

		$( accordion ).on( 'touchend', '.cndce-draggable, .cndce-free-draggable', function( e ){

			isDragSelected = false;


		} )


		$( accordion ).on( 'touchstart', '.cndce-sortable', function( e ){

			touchStartY = e.touches[0].pageY;
			isContainerScrolling = false;
			
		} );



		$( accordion ).on( 'touchmove', '.cndce-sortable', function( e ){

			if( !isDragSelected && !isContainerScrolling ){
				var currentScroll = $( window ).scrollTop(  );
				$( window ).scrollTop( currentScroll + touchStartY - e.touches[0].pageY );


			}


		} );




		$( window ).on( 'load', function(  ){
			console.log( 'finished loading' );

			$( accordion ).addClass( 'loaded' );

		} )
		

	}
} )