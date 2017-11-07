jQuery.fn.extend( {
	cndceLine: function( params ){
		// Defaults
		var defaults = {
			backgroundUrl: './assets/background.jpg',
			//backgroundUrl: 'transparent',
			jsonUrl: './data.json',

			pointDistance: '18%',
			pointSize: 2,
			pointColor: '#fff',

			strokeColor: 'rgba(255, 255, 255, 0.15)',
			strokeWidth: 1.5,

			curveVariance: 30,
			curveDeltaMovement: 0.015,
			curveMaxDeltaMovement: 20,

			elementDeltaMovement: 0.01,
			elementMaxDeltaMovement: 40,

			hoverRange: 130,

			renderRate: 15,

			defaultSubtitleIcon: 'bar-chart-o'
		};


		// Data Defaults
		var dataDefaults = {
			content: '',
			subtitle: '',
			subtitleIcon: false
		};



		// Variables
		var $canvas = $( '<canvas></canvas>' );
		var $backgroundContainer = $( '<div class="background-container"></div>' );
		var $canvasContainer = $( '<div class="canvas-container"></div>' );
		var $elementsContainer = $( '<div class="elements-container"></div>' );

		var $container = this;

		var ctx;
		window.points;

		var mouseX, mouseY;
		var mouseDownX, mouseDownY;
		window.maxScroll;

		var canvasTranslateX = 0;


		// Param Set Defaults
		if( params == undefined ){
			params = {};
		}


		for( var param in defaults ){
			if( defaults.hasOwnProperty( param ) ){
				if( !params.hasOwnProperty( param ) ){
					params[param] = defaults[param];
				}
			}
		}


		// Functions
		function initCanvas(  ){

			var tWidth = points[points.length - 1].x + params.pointSize;
			var tHeight = $canvas.outerHeight(  );

			if( Math.floor( $canvas[0].width ) != Math.floor( tWidth ) || Math.floor( $canvas[0].height ) != Math.floor( tHeight ) ){
				$canvas[0].width = tWidth;
				$canvas[0].height = tHeight;

				$canvasContainer.width( tWidth );

				$backgroundContainer.width( $canvasContainer.outerWidth( true ) );

				initPoints( points );
				initElements(  );


				maxScroll = -$canvasContainer.outerWidth( true ) + $container.outerWidth(  );


			}

			ctx = $canvas[0].getContext( '2d' );

			ctx.clearRect( 0, 0, $canvas[0].width, $canvas[0].height );

			drawPoints(  );
			drawCurve(  );
		}

		function initPoints( data ){
			points = data;

			var x = params.pointSize;
			var y;

			var distance = Number.parseFloat( params.pointDistance );
			var distanceUnit = params.pointDistance.match( /px|%/ )[0];


			if( distanceUnit === '%' ){
				distanceUnit = 'px';
				distance = $container.outerWidth(  ) * ( distance / 100 );
			}

			// Set point x, y value
			for( var i=0; i<points.length; i++ ){
				y = $canvas.outerHeight(  ) / 2;
				y += ( -1 * ( i % 2 ) ) * ( Math.random() * 100 ) % params.curveVariance;

				points[i].x = x;
				points[i].y = y;

				points[i].dX = 0;
				points[i].dY = 0;

				x += distance;
			}

			initMidBezierPoints(  );
		}

		function initElements( isNew ){

			if( isNew == undefined )
				isNew = false;

			// Elements
			for( var i=0; i<points.length; i++ ){
				var $element = $( '<div class="element"></div>' );
				var $elementWrapper = $( '<div class="element-wrapper"></div>' );

				if( isNew ){

					// Add Content
					if( points[i].content !== '' ){
						var $content = $( '<div class="element-content"></div>' );
						$content.append( points[i].content );

						$elementWrapper.append( $content );
						$elementWrapper.addClass( 'has-content' );
					}	

					// Add Subtitle
					if( points[i].subtitle !== '' ){
						var $subtitle = $( '<div class="element-subtitle"></div>' )

						// Subtitle Content
						var $subtitleContent = $( '<div class="subtitle-content"></div>' );
						$subtitleContent.append( points[i].subtitle );

						// Subtitle Icon
						if( points[i].subtitleIcon ){
							var $subtitleIcon = $( '<div class="subtitle-icon"></div>' );

							if( points[i].subtitleIcon == true )
								points[i].subtitleIcon = defaults.defaultSubtitleIcon;

							$subtitleIcon.append( '<i class="fa fa-' + points[i].subtitleIcon + '"></i>' );

							$subtitle.append( $subtitleIcon );
						}

						$subtitle.append( $subtitleContent );
						$elementWrapper.append( $subtitle );
					}

					$element.attr( 'data-index', i );
					$element.append( $elementWrapper );
					$elementsContainer.append( $element );
				}else{
						$element = $( '.element[data-index='+i+']', $elementsContainer );
				}

				$element.css( {
					top: points[i].By + 'px',
					left: points[i].Bx + 'px'
				} );
			}
		}

		function initMidBezierPoints(  ){
			// Set middle point x, y value on curve
			// Based on Quadratic Bezier Curve formula
			points[0].Bx = points[0].x + points[0].dX;
			points[0].By = points[0].y + points[0].dY;

			for( var i=0; i<points.length-2; i++ ){

				var t = 0.5;
				var t2 = t*t;
				var a = 1 - t;
				var a2 = a*a;

				points[i+1].Bx = 
					a2 * getMidPoint( 
						points[i].x + points[i].dX, 
						points[i+1].x + points[i+1].dX 
					)
					+ 2 * a * t * 
						( points[i+1].x + points[i+1].dX )

					+ t2 * getMidPoint( 
						points[i+1].x + points[i+1].dX, 
						points[i+2].x + points[i+2].dX 
					);



				points[i+1].By = 
					a2 * getMidPoint( 
						points[i].y + points[i].dY, 
						points[i+1].y + points[i+1].dY 
					)
					+ 2 * a * t * 
						( points[i+1].y + points[i+1].dY )

					+ t2 * getMidPoint( 
						points[i+1].y + points[i+1].dY, 
						points[i+2].y + points[i+2].dY 
					);

			}

			points[points.length-1].Bx = points[points.length-1].x + points[points.length-1].dX;
			points[points.length-1].By = points[points.length-1].y + points[points.length-1].dY;
		}

		function drawPoint( x, y ){
			ctx.fillStyle = params.pointColor;

			ctx.beginPath(  );
			ctx.arc( x, y, params.pointSize, 0, Math.PI * 2, true );
			ctx.fill(  );

		}

		function drawControlPoints(  ){

			for( var i=0; i<points.length; i++ ){
				drawPoint( points[i].x, points[i].y );

			}
		}

		function getMidPoint( p1, p2 ){
			return ( p1 + p2 ) / 2;
		}

		function drawPoints(  ){

			for( var i=0; i<points.length; i++ ){
				if( points[i].content == '' )
					drawPoint( points[i].Bx, points[i].By );
			}

		}

		function drawCurve(  ){
			ctx.strokeStyle = params.strokeColor;
			ctx.lineWidth = params.strokeWidth;

			// ctx.gobalAlpha = 0.2;

			ctx.moveTo( 
				points[0].x + points[0].dX, 
				points[0].y + points[0].dY
			);

	    	


			for( var i=0; i<points.length - 1; i++ ){
		    	ctx.quadraticCurveTo(
		    		points[i].x + points[i].dX, 
		    		points[i].y + points[i].dY, 
		    		getMidPoint( 
		    			points[i].x + points[i].dX, 
		    			points[i+1].x + points[i+1].dX 
		    		), 
		    		getMidPoint( 
		    			points[i].y + points[i].dY, 
		    			points[i+1].y + points[i+1].dY
		    		) 
		    	);
			}


	    	ctx.quadraticCurveTo(
	    		points[i].x + points[i].dX, 
	    		points[i].y + points[i].dY, 
	    		points[i].x + points[i].dX, 
	    		points[i].y + points[i].dY
	    	);

			 ctx.stroke(  );
		}

		function getPointsInRange( x, y ){
			var inRange = [];

			for( var i=0; i<points.length; i++ ){
				if( points[i].Bx >= x - params.hoverRange 
					&& points[i].Bx <= x + params.hoverRange
				 	&& points[i].By >= y - params.hoverRange 
				 	&& points[i].By <= y + params.hoverRange ){

					inRange.push( i );
				}

			}

			return inRange;
		}


		function render(  ){
			initMidBezierPoints(  );
			initCanvas(  );

			var inRange = getPointsInRange( mouseX, mouseY );

			for( var i=0; i<points.length; i++ ){
				var elementChange = false;

				var delta = params.curveDeltaMovement;
				var max = params.curveMaxDeltaMovement;

				// if( points[i].content !== '' ){
					delta = params.elementDeltaMovement;
					max = params.elementMaxDeltaMovement;
				// }

				if( inRange.indexOf( i ) != -1 ){
					
					var dX = ( max - Math.abs( points[i].dX ) ) * delta;
					var dY = ( max - Math.abs( points[i].dY ) ) * delta;

					if( points[i].x + points[i].dX > mouseX ){
						points[i].dX = Math.max( 
							points[i].dX - dX,
							- max
						);
					}else{
						points[i].dX = Math.min(
							points[i].dX + dX,
							max
						);
					}

					if( points[i].y + points[i].dY > mouseY ){
						points[i].dY = Math.max( 
							points[i].dY - dY,
							- max
						);
					}else{
						points[i].dY = Math.min(
							points[i].dY + dY,
							max
						);
					}

					elementChange = true;

				}else if( points[i].dX != 0 || points[i].dY != 0 ){
					var dX = points[i].dX * delta * 2;
					var dY = points[i].dY * delta * 2;

					// if( points[i].dX > 0 )
					// 	points[i].dX -= dX;
					// else
						points[i].dX -= dX; 

					// if( points[i].dY > 0 )
					// 	points[i].dY -= dY;
					// else
						points[i].dY -= dY;

					if( points[i].dX >= -0.5 && points[i].dX <= 0.5 ){
						points[i].dX = 0;
					}

					if( points[i].dY >= -0.5 && points[i].dY <= 0.5 ){
						points[i].dY = 0;
					} 

					elementChange = true;
				}

				if( elementChange /*&& points[i].content !== ''*/ ){
					$( '.element[data-index=' +i+']', $elementsContainer ).css( {
						transform: 'translate3d('
							+ points[i].dX + 'px,'
							+ points[i].dY + 'px,'
							+ '0'
						+ ')'
					} )
				}
			}
		}

		$( window ).resize( function(  ){

			initPoints( points );

			var tWidth = points[points.length - 1].x + params.pointSize;
			var tHeight = $canvas.outerHeight(  );

			$canvas[0].width = tWidth;
			$canvas[0].height = tHeight;

			$canvasContainer.width( tWidth );

			$backgroundContainer.width( $canvasContainer.outerWidth( true ) );

			initElements(  );


			maxScroll = -$canvasContainer.outerWidth( true ) + $container.outerWidth(  );

			console.log( $canvasContainer.outerWidth( true ) );
			console.log( $container.outerWidth(  ) );

		} );

		$( document ).ready( function( $ ){
			// Background
			$container.addClass( 'cndce-line' );
			$container.append( $backgroundContainer );

			//$backgroundContainer.append(
			//	'<img src="'
			//	+ params.backgroundUrl
			//	+ '">'
			//);

			// Canvas
			$container.append( $canvasContainer );
			$canvasContainer.append( $elementsContainer );
			$canvasContainer.append( $canvas );

			// Curve
			$.ajax( {
				dataType: 'json',
				url: params.jsonUrl,
				success: function( data ){
					// Make sure all items have content
					for( var i=0; i<data.items.length; i++ ){
						for( var param in dataDefaults ){
							if( dataDefaults.hasOwnProperty( param ) ){
								if( !data.items[i].hasOwnProperty( param ) ){
									data.items[i][param] = dataDefaults[param];
								}
							}
						}
					}

					initPoints( data.items );

					initElements( true );

					setInterval( render, params.renderRate );

				}
			});

			// Events
			$container.on( 'mouseenter', '.element-content', function(  ){
				$( this ).parent(  ).addClass( 'element-content-hovered' );
			} );

			$container.on( 'mouseleave', '.element-content', function(  ){
				$( this ).parent(  ).removeClass( 'element-content-hovered' );
				
			} );

			$container.on( 'mousemove', '.canvas-container', function( e ){

				mouseX = e.pageX - $( '.canvas-container', $container ).offset(  ).left;
				mouseY = e.pageY - $( '.canvas-container', $container ).offset(  ).top;
			});

			$container.on( 'mouseleave', '.canvas-container', function( e ){
				mouseX = -1000;
				mouseY = -1000;
			});

			function mousedown( e ){
				$container.addClass( 'mousedown' );
				mouseDownX = e.pageX - $container.offset(  ).left;

				var start = $canvasContainer.data( 'start' );
				
				if( start == undefined )
					start = 0;

				$canvasContainer.data( 'start', start + canvasTranslateX );
			}

			function mouseup( e ){
				$container.removeClass( 'mousedown' );

				mouseDownX = undefined;
			}

			function mousemove( e ){
				if( typeof e.preventDefault == 'function' )
					e.preventDefault(  );

				if( mouseDownX != undefined ){
					var x = e.pageX - $container.offset(  ).left;

					var tempX = x - mouseDownX;

					var left = Math.min( 
						$canvasContainer.data( 'start' ) + tempX,
						0
					);

					left = Math.max(
						left,
						maxScroll
					);


					// if( left < 0 && left > maxScroll ){

						$canvasContainer.css( {
							left: left + 'px'
						});

						$backgroundContainer.css( {
							left: left/2 + 'px'
						});

						canvasTranslateX = left - $canvasContainer.data( 'start' );

					// }
				}
			}

			$container.mousedown( mousedown );

			$container.mouseup( mouseup )

			$container.mousemove( mousemove );

			$container.on( 'touchstart', function( e ){
				mousedown( e.touches[0] )
			});

			$container.on( 'touchend', function( e ){
				mouseup( e.touches[0] );
			});

			$container.on( 'touchmove', function( e ){
				mousemove( e.touches[0] );
			});

			setInterval( function(  ){

			}, 100 );
		});
	}
} );