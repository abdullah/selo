/*
* 28 August 2016 Abdullah Mara  @abdullah
*/

var getParents = require('./helpers')

;(function () {
	
	function Selo(props) {
		if (!props.els) {
        
        var log = props.log != undefined ? props.log : true

        if (log) {
          console.log("[El parameters] is not defined, this element set as body  ")
        }
		}

		if (!document) {
			throw "[Platfrom] not supported"
		}

		this._arena      = null;
		this.selection  = null;
		this.els         = props.els || document.body;

		this.init()
	}

	Selo.prototype.init = function () {
		this._arena = this.els;
		this.selection = window.getSelection()

		this.attachEvent();
	}

	Selo.prototype.attachEvent = function () {

       var selectionEndTimeout = null,
          endEvent            = new CustomEvent('selectionEnd'),
          startEvent          = new CustomEvent('selectionStart',{detail:this.selection}),
          beforeStartEvent    = new CustomEvent('selectionBeforeStart');
            

      var map =  {
        65: false, 
        91: false,
        37: false,
        38: false,
        39: false,
        40: false,
        16: false,
      };
      
      var listener = [
        "mouseup",
        "selectionchange",
        "keyup",
        "keydown"
      ].map(function(e) {
        document.addEventListener(e.toString(), function(evt/*event*/) {
          

          if (evt.type != "selectionchange" && evt.type != "mouseup") {
            if (evt.type == "keydown") {
              map[evt.keyCode] = true

            }else{
              
              if (map[65] && map[91] ) {
                if (this.hasText()) {
                  document.dispatchEvent(endEvent);
                }
              }
              else if ((map[16] && map[37]) || (map[16] && map[38]) || (map[16] && map[39]) || (map[16] && map[40]) ) {
                if (this.hasText()) {
                  document.dispatchEvent(endEvent);
                }
              }else{
                // Object.keys(map).map(function(e){
                //   map[e] = false
                // })
              }
            }

          }

          console.log(map)


          if (evt.type == "selectionchange") {
            if (this.selection.type == "Range") {
              if (this.hasText()) {
                  document.dispatchEvent(startEvent);
              }
            }else{
                if (this.inArena()) {
                  document.dispatchEvent(beforeStartEvent);
                }
            }
            clearTimeout(selectionEndTimeout);
          }

          selectionEndTimeout = setTimeout(function(){
              if (evt.type == "mouseup" && this.hasText()) {
                  document.dispatchEvent(endEvent);
              }
          }.bind(this), 100);
        }.bind(this))
      }.bind(this))

    }
	
	
	Selo.prototype.hasText = function () {
      if (this.inArena()) {
        return  this.selection.toString() != ""
      }
      return false
    }

    Selo.prototype.inArena = function () {
      var _arena = document.querySelectorAll(this._arena)
      
      if (this.selection.focusNode) {

        var parents = getParents(this.selection.focusNode.parentNode);
        var tmp = false

        Object.keys(_arena).map(e => {
          if (parents.indexOf(_arena[e]) != -1) {
            tmp = true
          }
        })

        return tmp;
      }
      return false
    }

    Selo.prototype.getPositionRange = function () {
      
      var oRange = this.selection.getRangeAt(0); //get the text range
      var oRect = oRange.getBoundingClientRect();

      var bound = {};

      bound["left"] =  oRect.left
      bound["top"] =  oRect.top
      bound["getBoundingClientRect"] = oRect;
      return  bound
    }
    
    Selo.prototype.saveSelection = function ()  {
        if (window.getSelection) {
            var sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                return sel.getRangeAt(0);
            }
        } else if (document.selection && document.selection.createRange) {
            return document.selection.createRange();
        }
        return null;
    }

    Selo.prototype.restoreSelection  = function (range) {
        if (range) {
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.selection && range.select) {
                range.select();
            }
        }
    }


	if (typeof exports == "object") {
		module.exports = Selo
	} else if (typeof define == "function" && define.amd) {
	define([], function () {
		return Selo
	})
	} else if (window.Vue) {
		window.Selo = Selo
	}



})()