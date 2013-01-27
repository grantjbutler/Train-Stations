(function(__) {
	__.Engine = {
		_isRunning: false,
		_startTime: __.mozAnimationStartTime || Date.now(),
		
		_currentScreen: null,
		_currentOverlay: null,
		
		canvas: null,
		ctx: null,
		
		assets: {},
		
		render: function(timestamp) {
			var delta = timestamp - __.Engine._startTime;
			
			if(__.Engine._currentScreen != null) {
				if(__.Engine._currentOverlay == null) {
					__.Engine._currentScreen.update(delta);
				}
				
				CGContextSetFillColor(__.Engine.ctx, CGColorCreateGenericRGB(0.3922, 0.5843, 0.9294, 1.0));
				CGContextClearRect(__.Engine.ctx, CGRectMake(0, 0, __.Engine.ctx.canvas.width, __.Engine.ctx.canvas.height));
				CGContextFillRect(__.Engine.ctx, CGRectMake(0, 0, __.Engine.ctx.canvas.width, __.Engine.ctx.canvas.height));
				
				CGContextSaveGState(__.Engine.ctx);
				
				__.Engine._currentScreen.needsDisplay(delta, __.Engine.ctx);
				
				CGContextRestoreGState(__.Engine.ctx);
			}
			
			if(__.Engine._currentOverlay != null) {
				__.Engine._currentOverlay.update(delta);
				
				CGContextSaveGState(__.Engine.ctx);
				
				__.Engine._currentOverlay.needsDisplay(delta, __.Engine.ctx);
				
				CGContextRestoreGState(__.Engine.ctx);
			}
			
			if(__.Engine._isRunning) {
				__.Engine.requestAnimationFrame.call(__, __.Engine.render);
			}
		},
		
		init: function() {
			var imgs = document.getElementById('resources').getElementsByTagName('img');
			
			for(var i = 0; i < imgs.length; i++) {
				var lastSlash = imgs[i].src.lastIndexOf('/') + 1;
				var lastPeriod = imgs[i].src.lastIndexOf('.');
				var length = lastPeriod - lastSlash;
				
				__.Engine.assets[imgs[i].src.substr(lastSlash, length)] = imgs[i];
			}
			
			__.Engine.canvas = document.getElementById('game');
			__.Engine.ctx = __.Engine.canvas.getContext('2d');
			__.Engine.ctx.DOMElement = __.Engine.canvas;
			
			__.addEventListener('keydown', __.Engine.keyDown, false);
			__.addEventListener('keyup', __.Engine.keyUp, false);
			
			__.Engine.canvas.addEventListener('mousedown', __.Engine.mouseDown, false);
			__.Engine.canvas.addEventListener('mousemove', __.Engine.mouseMove, false);
			__.Engine.canvas.addEventListener('mouseup', __.Engine.mouseUp, false);
		},
		
		run: function(baseScreen) {
			__.Engine._isRunning = true;
			
			if(baseScreen != null) {
				__.Engine.setScreen(baseScreen);
			}
			
			__.Engine.requestAnimationFrame.call(__, __.Engine.render);
		},
		
		setScreen: function(screen) {
			__.Engine._currentScreen = screen;
		},
		
		showOverlay: function(overlay) {
			__.Engine._currentOverlay = overlay;
		},
		
		hideOverlay: function() {
			__.Engine._currentOverlay = null;
		},
		
		keyDown: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			var firstResponder = __.Engine._currentOverlay || __.Engine._currentScreen;
			
			if(!firstResponder) {
				return;
			}
		
			if('keyDown' in firstResponder) {
				var keyCode = e.keyCode || e.which;
				
				var key = String.fromCharCode(keyCode).replace(/[^a-zA-Z0-9]+/, '');
				
				if(!key.length) {
					if(keyCode == 27) {
						key = "Esc";
					}
				}
				
				firstResponder.keyDown(key.toLowerCase());
				
				e.preventDefault();
				e.stopPropagation();
			}
		},
		
		keyUp: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			var firstResponder = __.Engine._currentOverlay || __.Engine._currentScreen;
			
			if(!firstResponder) {
				return;
			}
		
			if('keyDown' in firstResponder) {
				var keyCode = e.keyCode || e.which;
				
				var key = String.fromCharCode(keyCode).replace(/[^a-zA-Z0-9]+/, '');
				
				if(!key.length) {
					if(keyCode == 27) {
						key = "Esc";
					}
				}
				
				firstResponder.keyUp(key.toLowerCase());
				
				e.preventDefault();
				e.stopPropagation();
			}
		},
		
		mouseDown: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			var origin = CGPointMake(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
			
			var firstResponder = __.Engine._currentOverlay || __.Engine._currentScreen;
			
			if(!firstResponder) {
				return;
			}
			
			if(e.button == 2) { // Right click
				if('rightMouseDown' in firstResponder) {
					firstResponder.rightMouseDown(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			} else if(e.button == 0) { // Left click
				if('mouseDown' in firstResponder) {
					firstResponder.mouseDown(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			}
		},
		
		mouseMove: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			var origin = CGPointMake(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
			
			var firstResponder = __.Engine._currentOverlay || __.Engine._currentScreen;
			
			if(!firstResponder) {
				return;
			}
			
			if(e.button == 2) { // Right click
				if('rightMouseMove' in firstResponder) {
					firstResponder.rightMouseMove(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			} else if(e.button == 0) { // Left click
				if('mouseMove' in firstResponder) {
					firstResponder.mouseMove(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			}
		},
		
		mouseUp: function(e) {
			if(e.metaKey) {
				// We don't capture keyboard shortcuts
				return;
			}
			
			var origin = CGPointMake(e.clientX - e.target.offsetLeft, e.clientY - e.target.offsetTop);
			
			var firstResponder = __.Engine._currentOverlay || __.Engine._currentScreen;
			
			if(!firstResponder) {
				return;
			}
			
			if(e.button == 2) { // Right click
				if('rightMouseUp' in firstResponder) {
					firstResponder.rightMouseUp(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			} else if(e.button == 0) { // Left click
				if('mouseUp' in firstResponder) {
					firstResponder.mouseUp(origin);
					
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}
	};
	
	if('mozRequestAnimationFrame' in __) {
		__.Engine.requestAnimationFrame = __.mozRequestAnimationFrame;
	} else if('msRequestAnimationFrame' in __) {
		__.Engine.requestAnimationFrame = __.msRequestAnimationFrame;
	} else if('webkitRequestAnimationFrame' in __) {
		__.Engine.requestAnimationFrame = __.webkitRequestAnimationFrame;
	} else if('requestAnimationFrame' in __) {
		__.Engine.requestAnimationFrame = __.requestAnimationFrame;
	} else {
		__.Engine.requestAnimationFrame = function(fn) {
			setTimeout(fn, 1000 / 60);
		};
	}
	
	__.Engine.Screen = new Class({
		_children: [],
		
		addChild: function(child) {
			this._children.push(child);
		},
		
		removeChild: function(child) {
			for(var i = 0; i < this._children.length; i++) {
				if(this._children[i] == child) {
					this._children.splice(i, 1);
					
					break;
				}
			}
		},
		
		needsDisplay: function(delta, ctx) {
			this.render(delta, ctx);
			
			this._children.forEach(function(child) {
				CGContextSaveGState(ctx);
				
				child.render(ctx);
				
				CGContextRestoreGState(ctx);
			});
		},
		
		render: function(delta, ctx) {
			
		},
		
		update: function(delta) {
			
		},
		
		mouseDown: function(point) {
			this._children.forEach(function(child) {
				if(CGRectContainsPoint(child.frame, point)) {
					child.mouseDown(point);
				}
			});
		},
		
		mouseMove: function(point) {
			this._children.forEach(function(child) {
				child.mouseMove(point);
			});
		},
		
		mouseUp: function(point) {
			this._children.forEach(function(child) {
				child.mouseUp(point);
			});
		},
	});
	
	__.Engine.Overlay = new Class({
		Extends: __.Engine.Screen,
		
		initialize: function() {
			var closeButton = new __.Engine.UI.Button(CGRectMake(10, 10, 22, 22));
			closeButton.image = __.Engine.assets['close-button'];
			closeButton.style = __.Engine.UI.Button.Style.PLAIN;
			closeButton.addEvent('click', function() {
				__.Engine.hideOverlay();
			});
			this.addChild(closeButton);
		},
		
		render: function(delta, ctx) {
			CGContextSaveGState(ctx);
			
			CGContextSetFillColor(ctx, CGColorCreateGenericRGB(0.0, 0.0, 0.0, 0.5));
			CGContextFillRect(ctx, CGRectMake(0, 0, __.Engine.canvas.width, __.Engine.canvas.height));
			
			CGContextRestoreGState(ctx);
		},
		
		update: function(delta) {
			
		},
		
		keyUp: function(key) {
			if(key == "esc") {
				__.Engine.hideOverlay();
			}
 		}
	});
	
	__.Engine.UI = {};
	
	__.Engine.UI.View = new Class({
		frame: CGRectMakeZero(),
		
		mouseMove: function(point) {
			
		},
		
		mouseDown: function(point) {
			
		},
		
		mouseUp: function(point) {
			
		}
	});
	
	__.Engine.UI.Button = new Class({
		Extends: __.Engine.UI.View,
		
		Implements: [Events],
		
		_text: "",
		_textMeasurements: { width: 0, height: 0 },
		
		_font: null,
		_fontSize: 18,
		
		highlighted: false,
		hovered: false,
		disabled: false,
		_mouseDown: false,
		
		style: 1,
		
		image: null,
		
		_buttonBG: null,
		_buttonBGSelected: null,
		
		Attributes: {
			font: {
				set: function(newFont) {
					this._font = new Font();
					this._font.fontFamily = newFont;
					this._font.src = this._font.fontFamily;
					
					this._font.onload = (function() {
						this._measureText();
					}.bind(this));
					
					this._font.onerror = function() {
						console.log(arguments);
					}
				},
				get: function() {
					return this._font.fontFamily;
				}
			},
			
			text: {
				set: function(text) {
					this._text = text;
					
					this._measureText();
				},
				
				get: function() {
					return this._text;
				}
			},
			
			fontSize: {
				set: function(size) {
					this._fontSize = size;
					
					this._measureText();
				},
				
				get: function() {
					return this._fontSize;
				}
			}
		},
		
		_measureText: function() {
			if(!this._font.loaded) {
				return;
			}
			
			this._textMeasurements = this._font.measureText(this.text, this.fontSize);
			
			if(this.frame.size.width == 0 || this.frame.size.height == 0) {
				this.sizeToFit();
			}
		},
		
		initialize: function(frame) {
			this.frame = frame || CGRectMakeZero();
			
			this.font = "Helvetica";
			
			this._buttonBG = __.Engine.assets['button'];
			this._buttonBGSelected = __.Engine.assets['button-pressed'];
		},
		
		sizeToFit: function() {
			if(!this._font || !this._font.loaded) {
				return;
			}
			
			var textSize = this._textMeasurements;
			
			this.frame.size.width = textSize.width + 20;
			this.frame.size.height = textSize.height + 20;
		},
		
		render: function(ctx) {
			// TODO: Replace this with button stylings.

			var img = this._buttonBG;
			
			if(this.highlighted) {
				img = this._buttonBGSelected;
			}

			
			if(this.disabled) {
				CGContextSetAlpha(ctx, 0.5);
			}
			
			if(this.style == __.Engine.UI.Button.Style.BORDERED) {
				ctx.drawImage(img, 0, 0, 12, img.height, this.frame.origin.x, this.frame.origin.y, 12, this.frame.size.height);
				ctx.drawImage(img, img.width - 12, 0, 12, img.height, this.frame.origin.x + this.frame.size.width - 12, this.frame.origin.y, 12, this.frame.size.height);
				CGContextDrawTiledImage(ctx, CGRectMake(13, 0, 1, img.height), CGRectInset(this.frame, 12, 0), img);
			}
			
			if(this.text.length && this._font && this._font.loaded) {
				CGContextSetFillColor(ctx, CGColorCreateGenericRGB(1, 1, 1, 1.0));
				
				var textSize = this._textMeasurements;
				
				var origin = CGPointMake(CGRectGetMinX(this.frame) + ROUND((CGRectGetWidth(this.frame) - textSize.width) / 2.0), CGRectGetMinY(this.frame) + ROUND((CGRectGetHeight(this.frame) - textSize.height) / 2.0));
				
				ctx.font = this.fontSize + "px " + this.font;
				ctx.textBaseline = "top";
				ctx.fillText(this.text, origin.x, origin.y - 2);
			}
			
			if(this.image) {
				CGContextDrawImage(ctx, CGRectMake(CGRectGetMinX(this.frame) + ROUND((this.frame.size.width - this.image.width) / 2.0), CGRectGetMinY(this.frame) + ROUND((this.frame.size.height - this.image.height) / 2.0), this.image.width, this.image.height), { _image: this.image });
			}
		},
		
		mouseMove: function(point) {
			if(this.disabled) {
				return;
			}
			
			this.hovered = CGRectContainsPoint(this.frame, point);
			
			if(this._mouseDown) {
				this.highlighted = CGRectContainsPoint(CGRectInset(this.frame, -20, -20), point);
			}
		},
		
		mouseDown: function(point) {
			if(this.disabled) {
				return;
			}
			
			this.highlighted = CGRectContainsPoint(this.frame, point);
			this._mouseDown = true;
		},
		
		mouseUp: function(point) {
			if(this.disabled) {
				return;
			}
			
			if(this.highlighted && this._mouseDown) {
				this.fireEvent('click');
			}
			
			this._mouseDown = false;
			this.highlighted = false;
		}
	});
	
	__.Engine.UI.Button.Style = {};
	__.Engine.UI.Button.Style.BORDERED = 1;
	__.Engine.UI.Button.Style.PLAIN = 2;
	
	__.Engine.UI.Label = new Class({
		Extends: __.Engine.UI.View,
		
		_text: "",
		_textMeasurements: { width: 0, height: 0 },
		
		_font: null,
		_fontSize: 18,
		
		Attributes: {
			font: {
				set: function(newFont) {
					this._font = new Font();
					this._font.fontFamily = newFont;
					this._font.src = this._font.fontFamily;
					
					this._font.onload = (function() {
						this._measureText();
					}.bind(this));
					
					this._font.onerror = function() {
						console.log(arguments);
					}
				},
				get: function() {
					return this._font.fontFamily;
				}
			},
			
			text: {
				set: function(text) {
					this._text = text;
					
					this._measureText();
				},
				
				get: function() {
					return this._text;
				}
			},
			
			fontSize: {
				set: function(size) {
					this._fontSize = size;
					
					this._measureText();
				},
				
				get: function() {
					return this._fontSize;
				}
			}
		},
		
		_measureText: function() {
			if(!this._font.loaded) {
				return;
			}
			
			this._textMeasurements = this._font.measureText(this.text, this.fontSize);
			
			if(this.frame.size.width == 0 || this.frame.size.height == 0) {
				this.sizeToFit();
			}
		},
		
		initialize: function(frame) {
			this.frame = frame || CGRectMakeZero();
			
			this.font = "Helvetica";
		},
		
		sizeToFit: function() {
			if(!this._font || !this._font.loaded) {
				return;
			}
			
			var textSize = this._textMeasurements;
			
			this.frame.size.width = textSize.width;
			this.frame.size.height = textSize.height;
		},
		
		render: function(ctx) {
			if(this.text.length && this._font && this._font.loaded) {
				CGContextSetFillColor(ctx, CGColorCreateGenericRGB(1, 1, 1, 1.0));
				
				var textSize = this._textMeasurements;
				
				var origin = CGPointMake(CGRectGetMinX(this.frame) + ROUND((CGRectGetWidth(this.frame) - textSize.width) / 2.0), CGRectGetMinY(this.frame) + ROUND((CGRectGetHeight(this.frame) - textSize.height) / 2.0));
				
				ctx.font = "bold " + this.fontSize + "px " + this.font;
				ctx.textBaseline = "top";
				ctx.fillText(this.text, origin.x, origin.y - 2);
			}
		}
	});
	
	__.Engine.UI.ImageView = new Class({
		Extends: __.Engine.UI.View,
		
		image: null,
		
		initialize: function(frame) {
			if(frame instanceof HTMLImageElement) {
				this.image = frame;
			} else {
				this.frame = frame || CGRectMakeZero();
			}
		},
		
		sizeToFit: function() {
			if(!this.image) {
				return;
			}
			
			this.frame.size.width = this.image.width;
			this.frame.size.height = this.image.height;
		},
		
		render: function(ctx) {
			CGContextDrawImage(ctx, this.frame, { _image: this.image });
		}
	});
})(window);

(function(__) {
	var Game = (function() {
		var __GAME = new Class({
			state: 1, // 1 is "MENU".
			
			money: 2000,
			
			trains: [],
			
			hasTracks: [2],
			hasPlatforms: [1],
		});
		
		__GAME.State = {};
		__GAME.State.MENU = 1;
		__GAME.State.GAME = 2;
		
		__GAME.Prices = {};
		__GAME.Prices.TRACK = 500;
		__GAME.Prices.PLATFORM = 350;
/* 		__GAME.Prices.PLATFORM_AND_TRACK = 750; */
		
		__SHARED_GAME = null;
		
		__GAME.sharedGame = function() {
			if(__SHARED_GAME == null) {
				__SHARED_GAME = new __GAME();
			}
			
			return __SHARED_GAME;
		};
		
		return __GAME;
	})();
	
	var MainScreen = new Class({
		Extends: __.Engine.Screen,
		
		_font: null,
		
		initialize: function() {
			var startGameButton = new __.Engine.UI.Button(CGRectMake((__.Engine.canvas.width - 125) / 2.0, 375, 125, 48));
			startGameButton.text = "Start Game";
			startGameButton.addEvent('click', function() {
				Game.sharedGame().state = Game.State.GAME;
				
				__.Engine.setScreen(new GameScreen());
			});
			
			this.addChild(startGameButton);
			
			var titleLabel = new __.Engine.UI.Label(CGRectMake((__.Engine.canvas.width - 300) / 2.0, 30, 300, 60));
			titleLabel.text = "Station Master";
			titleLabel.fontSize = 48;
			
			this.addChild(titleLabel);
		},
		
		render: function(delta, ctx) {
			ctx.drawImage(__.Engine.assets['title-screen'], 0, 0);
			
		}
	});
	
	var GameScreen = new Class({
		Extends: __.Engine.Screen,
		
		map: null,
		
		tilemap: [
			[ ], // Grass and ground
			[ ], // tracks and platforms
			[ ], // Anything else, like ticket machines
		],
		
		trains : [],
		
		platforms : [],
		
		tracks : [],
		
		numberOfCustomers : 0,
		
		initialize: function() {
			this.map = __.Engine.assets['tilemap'];
			
			var yCount = __.Engine.canvas.height / 48;
			var xCount = __.Engine.canvas.width / 48;
			
			this.platforms.push(new Platform(false));
			this.platforms.push(new Platform(true));
			
			this.money = 10000;
			
			for(var layer = 0, count = this.tilemap.length; layer < count; layer++) {
				this.tilemap[layer] = new Array(xCount);
				
				for(var i = 0; i < this.tilemap[layer].length; i++) {
					this.tilemap[layer][i] = new Array(yCount);
				}
			}
			
			for(var i = 0; i < this.tilemap[1].length; i++) {
				this.tilemap[1][i][6] = 13;
			}
			
			this.tilemap[1][0][7] = 6;
			this.tilemap[1][14][7] = 8;
			
			for(var i = 1; i < this.tilemap[1].length - 1; i++) {
				this.tilemap[1][i][7] = 7;
			}
			
			this.tilemap[1][0][8] = 14;
			this.tilemap[1][14][8] = 16;
			
			for(var i = 1; i < this.tilemap[1].length - 1; i++) {
				this.tilemap[1][i][8] = 15;
			}
			
			for(var y = 0; y < yCount; y++) {
				for(var x = 0; x < xCount; x++) {
					this.tilemap[0][x][y] = FLOOR(RAND() * 5) + 1;
				}
			}
			
			this.trains.push(new Train(2));
			
			var tracksPlatformsButton = new __.Engine.UI.Button(CGRectMake(__.Engine.canvas.width - 10 - 200, 10, 200, 48));
			tracksPlatformsButton.text = "Tracks & Platforms";
			tracksPlatformsButton.addEvent('click', function() {
				__.Engine.showOverlay(new TracksPlatformsOverlay());
			});
			this.addChild(tracksPlatformsButton);
			
			var trainsButton = new __.Engine.UI.Button(CGRectMake(CGRectGetMinX(tracksPlatformsButton.frame) - 10 - 100, 10, 100, 48));
			trainsButton.text = "Trains";
			trainsButton.addEvent('click', function() {
				__.Engine.showOverlay(new TrainsOverlay());
			});
			this.addChild(trainsButton);
		},
		
		update : function(delta) {
			for(var i=0; i < this.trains.length; i++) {
				this.trains[i].update(delta);
			}
			this.numberOfCustomers += Math.floor(Math.random() * (this.platforms.length)) + 1;
		},
		
		render: function(delta, ctx) {
			for(var layer = 0, count = this.tilemap.length; layer < count; layer++) {
				for(var x = 0, xCount = this.tilemap[layer].length; x < xCount; x++) {
					for(var y = 0, yCount = this.tilemap[layer][x].length; y < yCount; y++) {
						var val = this.tilemap[layer][x][y];
						
						ctx.drawImage(this.map, ((val - 1) % 4) * 48, FLOOR((val - 1) / 4) * 48, 48, 48, x * 48, y * 48, 48, 48);
					}
				}
			}
			for(var i=0; i < this.trains.length; i++) {
				this.trains[i].render(ctx);
			}
		},
		
		ticketTransaction : function() {
			if (this.numberOfCustomers < 200) {
				this.money += (this.numberOfCustomers * 5);
				this.numberOfCustomers = 0;
			} else {
				this.money += (200 * 5);
				this.numberOfCustomers -= 200;
			}
		}
	});
	
	var TrainsOverlay = new Class({
		Extends: __.Engine.Overlay,
	});
	
	var TracksPlatformsOverlay = new Class({
		Extends: __.Engine.Overlay,
		
		map: null,
		
		_tilemap: [
			[13, 13, 13, 13, 13, 13, 13, 13],
			[ 6,  7,  7,  7,  7,  7,  7,  8],
			[14, 15, 15, 15, 15, 15, 15, 16],
			[13, 13, 13, 13, 13, 13, 13, 13],
			[13, 13, 13, 13, 13, 13, 13, 13],
			[ 6,  7,  7,  7,  7,  7,  7,  8],
			[14, 15, 15, 15, 15, 15, 15, 16],
			[13, 13, 13, 13, 13, 13, 13, 13]
		],
		
		_tilemapOrigin: null,
		_tilemapSize: null,
		
		initialize: function() {
			this.parent();
			
			var titleLabel = new __.Engine.UI.Label(CGRectMake(((__.Engine.canvas.width - 200) / 2.0), 10, 200, 40));
			titleLabel.text = "Tracks & Platforms";
			this.addChild(titleLabel);
			
			this.map = __.Engine.assets['tilemap'];
			
			this._tilemapSize = CGSizeMake(this._tilemap[0].length * 48, this._tilemap.length * 48);
			this._tilemapOrigin = CGPointMake((__.Engine.canvas.width - this._tilemapSize.width) / 2.0, 65);
		},
		

		render: function(delta, ctx) {
			this.parent(delta, ctx);
			
			var isTrack = false;
			
			var trackIndex = 0;
			var platformIndex = -1;
			
			for(var y = 0; y < this._tilemap.length; y++) {
				for(var x = 0; x < this._tilemap[y].length; x++) {
					var val = this._tilemap[y][x];
					
					isTrack = (val == 13);
					
					if(val == 6) {
						platformIndex++;
					}
					
					ctx.drawImage(this.map, ((val - 1) % 4) * 48, FLOOR((val - 1) / 4) * 48, 48, 48, this._tilemapOrigin.x + x * 48, this._tilemapOrigin.y + y * 48, 48, 48);
				}
				
				CGContextSaveGState(ctx);
				
				ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
				
				if(isTrack) {
					if(Game.sharedGame().hasTracks.indexOf(trackIndex) == -1) {
						CGContextFillRect(ctx, CGRectMake(this._tilemapOrigin.x, this._tilemapOrigin.y + y * 48, this._tilemapSize.width, 48));
					}
					
					trackIndex++;
				} else {
					if(Game.sharedGame().hasPlatforms.indexOf(platformIndex) == -1) {
						CGContextFillRect(ctx, CGRectMake(this._tilemapOrigin.x, this._tilemapOrigin.y + y * 48, this._tilemapSize.width, 48));
					}
				}
				
				CGContextRestoreGState(ctx);
				
				isTrack = false;
			}
		},
		
		mouseUp: function(point) {
				this.parent(point);
			
			if(!CGRectContainsPoint(CGRectMake(this._tilemapOrigin.x, this._tilemapOrigin.y, this._tilemapSize.width, this._tilemapSize.height), point)) {
				return;
			}
			
			var y = point.y - this._tilemapOrigin.y;
			
			var i = FLOOR(y / 48);
			
			var platformIndex = -1;
			var trackIndex = 0;
			
			var isTrack = false;
			
			for(var j = 0; j < this._tilemap.length; j++) {
				isTrack = (this._tilemap[j][0] == 13);
				
				if(this._tilemap[j][0] == 6) {
					platformIndex++;
				}
				
				if(i == j) {
					break;
				}
				
				if(this._tilemap[j][0] == 13) {
					trackIndex++;
				}
			}
			
			var platformsToBuy = [];
			var tracksToSell = [];
			
			var buying = true;
			
			if(isTrack) {
				if(Game.sharedGame().hasTracks.indexOf(trackIndex) == -1) {
					if(i < this._tilemap.length - 1) {
						if(this._tilemap[i + 1][0] == 6) {
							if(Game.sharedGame().hasPlatforms.indexOf(platformIndex + 1) == -1) {
								platformsToBuy.push(platformIndex + 1);
							}
						}
					}
					
					if(i > 0) {
						if(this._tilemap[i - 1][0] == 14) {
							if(Game.sharedGame().hasPlatforms.indexOf(platformIndex) == -1) {
								platformsToBuy.push(platformIndex);
							}
						}
					}
				} else {
					buying = false;
				}
			} else {
				if(Game.sharedGame().hasPlatforms.indexOf(platformIndex) != -1) {
					if((i - 1 >= 0 && this._tilemap[i - 1][0] == 13) || (i - 2 >= 0 && this._tilemap[i - 2][0] == 13)) {
						tracksToSell.push(trackIndex - 1);
					}
					
					if((i + 1 < this._tilemap.length && this._tilemap[i + 1][0] == 13) || (i + 2 < this._tilemap.length && this._tilemap[i + 2][0] == 13)) {
						tracksToSell.push(trackIndex);
					}
					
					buying = false;
				}
			}
			
			var price = 0;
			
			if(isTrack) {
				if(buying) {
					price = Game.Prices.TRACK;
					price += (Game.Prices.PLATFORM * 0.8) * platformsToBuy.length;
				} else {
					price = Game.Prices.TRACK * 0.8;
				}
			} else {
				if(buying) {
					price = Game.Prices.PLATFORM;
				} else {
					price = (Game.Prices.PLATFORM + (Game.Prices.TRACK * tracksToSell.length)) * 0.8;
				}
			}
			
			if(buying) {
				if(Game.sharedGame().money < price) {
					alert('You don\'t have enough funds to purchase that.');
					
					return;
				}
			}
			
			var text = '';
			
			if(buying) {
				if(isTrack) {
					text = 'Are you sure you want to buy this track for ' + price + '?';
					
					if(platformsToBuy.length) {
						text += ' You\'ll need to buy ' + platformsToBuy.length + ' platform' + ((platformsToBuy.length != 1) ? 's' : '') + ' to use the track.';
					}
				} else {
					text = 'Are you sure you want to buy this platform for ' + price + '?';
				}
				
				if(!confirm(text)) {
					return;
				}
				
				Game.sharedGame().money -= price;
				
				if(isTrack) {
					Game.sharedGame().hasTracks.push(trackIndex);
					
					platformsToBuy.forEach(function(platform) {
						Game.sharedGame().hasPlatforms.push(platform);
					});
				} else {
					Game.sharedGame().hasPlatforms.push(platformIndex);
				}
			} else {
				if(isTrack) {
					text = 'Are you sure you want to sell this track for ' + price + '?';
				} else {
					text = 'Are you sure you want to sell this platform for ' + price + '?';
					
					if(tracksToSell.length) {
						text += ' You\'ll need to sell ' + tracksToSell.length + ' track' + ((tracksToSell.length != 1) ? 's' : '') + '.'	;
					}
				}
				
				if(!confirm(text)) {
					return;
				}
				
				Game.sharedGame().money += price;
				
				if(isTrack) {
					var i = Game.sharedGame().hasTracks.indexOf(trackIndex);
					
					if(i != -1) {
						Game.sharedGame().hasTracks.splice(i, 1);
					}
				} else {
					var i = Game.sharedGame().hasPlatforms.indexOf(platformIndex);
					
					if(i != -1) {
						Game.sharedGame().hasPlatforms.splice(i, 1);
					}
					
					tracksToSell.forEach(function(track) {
						var i = Game.sharedGame().hasTracks.indexOf(track);
						
						if(i != -1) {
							Game.sharedGame().hasTracks.splice(i, 1);
						}
					});
				}
			}
		}
	});
	
	var Train = new Class({
		Extends: __.Engine.UI.View,
		isTraveling: false,
		returnTimer:0,
		track:0,
		travelTime : 200,
		defaultTravelTime : 200,
		stationIdleTime : 200,
		defaultStationIdleTime : 200,
		flip : false,
		initialize : function(track) {
			this.frame = CGRectMake(-192*4,0,192*3,48);
			this.track = track;
			this.locomotive = __.Engine.assets['locomotive1'];
			this.flippedLocomotive = __.Engine.assets['locomotive1-flipped'];
			this.flippedCar = __.Engine.assets['car1-flipped'];
			this.car = __.Engine.assets['car1'];
			this.travelTime = 1000;
			this.defaultTravelTime = 1000;
			this.stationIdleTime = 200;
			this.defaultStationIdleTime = 200;
			this.flip = false;
			switch(this.track) {
				case 0:
				this.frame.origin.y = 96;
				break;
				
				case 1:
				this.frame.origin.y = 240;
				break;
				
				case 2: 
				this.frame.origin.y = 288;
				break;
				
				case 3:
				this.frame.origin.y = 432;
				break;
			}
		},
		update : function(delta) {
			var endX = 0;
			if(!this.isTraveling) {
				if (this.flip) {
					endX = 48;
					if (this.frame.origin.x > endX) {
						this.frame.origin.x -= 3;
						if (this.frame.origin.x < endX) {
							this.frame.origin.x = endX;
							__.Engine._currentScreen.ticketTransaction();
						}
					}
					if (this.frame.origin.x <= endX) {
						this.stationIdleTime--;
						if (this.stationIdleTime == 0) {
							this.isTraveling = true;
							this.stationIdleTime = this.defaultStationIdleTime;
						}
					}
				} else {
					endX = __.Engine.canvas.width - 48;
					if (this.frame.origin.x+this.frame.size.width < endX) {
						this.frame.origin.x += 3;
						if (this.frame.origin.x+this.frame.size.width > endX) {
							this.frame.origin.x = endX-this.frame.size.width;
							__.Engine._currentScreen.ticketTransaction();
						}
					}
					if (this.frame.origin.x+this.frame.size.width == endX) {
						this.stationIdleTime--;
						if (this.stationIdleTime == 0) {
							this.isTraveling = true;
							this.stationIdleTime = this.defaultStationIdleTime;
						}
					}
				}
			} else {
				if (this.flip) {
					if (this.frame.origin.x > (-192) * 4) {
						this.frame.origin.x -= 3;
						if (this.frame.origin.x < (-192) * 4) {
							this.frame.origin.x = (-192) * 4;
						}
					}
					if (this.frame.origin.x == (-192) * 4) {
						this.travelTime--;
						if (this.travelTime == 0) {
							this.flip = false;
							this.travelTime = this.defaultTravelTime;
							this.isTraveling = false;
						}
					}
				} else {
					if (this.frame.origin.x < __.Engine.canvas.width + (192 * 4)) {
						this.frame.origin.x += 3;
						if (this.frame.origin.x > __.Engine.canvas.width + (192 * 4)) {
							this.frame.origin.x = __.Engine.canvas.width + (192 * 4);
						}
					}
					if (this.frame.origin.x == __.Engine.canvas.width + (192 * 4)) {
							this.travelTime--;
							if (this.travelTime == 0) {
								this.flip = true;
								this.travelTime = this.defaultTravelTime;
								this.isTraveling = false;
							}
						}
				}
			}
		}, 
		render : function(ctx) {
			//if (!this.isTraveling) {
				if (this.flip) {
					ctx.drawImage(this.flippedLocomotive, this.locomotive.width, 0,-this.locomotive.width, 48,this.frame.origin.x,this.frame.origin.y,this.locomotive.width,this.locomotive.height);
					ctx.drawImage(this.flippedCar, 0, 0,this.car.width, 48,this.frame.origin.x+192,this.frame.origin.y,this.car.width,this.car.height);
					ctx.drawImage(this.flippedCar, 0, 0,this.car.width, 48,this.frame.origin.x+(192*2),this.frame.origin.y,this.car.width,this.car.height);

				} else {
					ctx.drawImage(this.locomotive, 0, 0,this.locomotive.width, 48,this.frame.origin.x+(192*2),this.frame.origin.y,this.locomotive.width,this.locomotive.height);
					ctx.drawImage(this.car, 0, 0,this.car.width, 48,this.frame.origin.x+192,this.frame.origin.y,this.car.width,this.car.height);
					ctx.drawImage(this.car, 0, 0,this.car.width, 48,this.frame.origin.x,this.frame.origin.y,this.car.width,this.car.height);
				}
			//}
		},
	});
	
	var Platform = new Class({
		active : false,
		cost : 7500,
		sellPrice : 3000,
		initialize : function(active) {
			this.active = active;
			this.cost = 7500;
			this.sellPrive = 3000;
		}
	});
	
	var Track = new Class({
		active : false,
		cost : 4000,
		sellPrice : 1800,
		initialize : function(active) {
			this.active = active;
			this.cost = 4000;
			this.sellPrive = 1800;
		}
	});
	
	window.addEventListener('load', function() {
		__.Engine.init();
		__.Engine.run(new MainScreen());	
	}, false);
})(window);
