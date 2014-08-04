(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var $ = (window.jQuery);

/**
 * Autoscale takes an element and make sure it fits its container.
 * @constructor
 * @param {HTMLElement} el - The DOM element.
 * @param {{autoscale: string}} options - The options.
 */
function Autoscale(el, options) {
  this.el = $(el);
  this.options = $.extend({}, Autoscale.DEFAULTS, options);
  this.parent = this.el.offsetParent();
  this.init();
}

/**
 * Autoscale Default Settings
 * @type {{autoscale: string, ratio: string, height: number, width: number}}
 */
Autoscale.DEFAULTS = {
  autoscale: 'cover',
  ratio: undefined,
  height: undefined,
  width: undefined
};

/**
 * Initialize an Autoscale Instance.
 * Set resize handler for keeping media
 * in correct scale and position.
 */
Autoscale.prototype.init = function() {
  this.ratio = this.options.ratio;
  this.refresh();
  this.refresh = this.refresh.bind(this);
  this.isAnimating = false;
  $(window).on('resize.aranja', this.handleResize.bind(this));
  // Refresh when images are loaded
  this.el.on('load.aranja', this.refresh.bind(this));
  
  // Force size if set
  if (this.options.width && this.options.height) {
    this.el.width(this.options.width);
    this.el.height(this.options.height);
    this.refresh();
  }
};

/**
 * Calculate CSS values for scale and position.
 * @param parent
 * @param ratio
 * @returns {{
 *   width: number,
 *   height: number,
 * }}
 */
Autoscale.prototype.getSize = function() {
  var parentHeight = this.parent.height(),
      parentWidth = this.parent.width(),
      parentRatio = parentWidth / parentHeight;
  
  if (!this.ratio) {
    this.ratio = this.el.width() / this.el.height();
  }

  if (this.options.autoscale === 'cover' && this.ratio <= parentRatio) {
    return {
      width: parentWidth,
      height: parentWidth / this.ratio
    };
  }

  return {
    height: parentHeight,
    width: parentHeight * this.ratio
  };
};

/**
 * Refresh Element
 */
Autoscale.prototype.refresh = function() {
  var size = this.getSize();
  if (!size.width || !size.height) return;

  this.el.css({
    top: '50%',
    left: '50%',
    position: 'absolute',
    width: size.width + 'px',
    height: size.height + 'px',
    marginLeft: -0.5 * size.width + 'px',
    marginTop: -0.5 * size.height + 'px'
  });

  this.isAnimating = false;
};

/**
 * Resize Handler
 */
Autoscale.prototype.handleResize = function() {
  if (!this.isAnimating) {
    window.requestAnimationFrame(this.refresh);
  }

  this.isAnimating = true;
};

module.exports = Autoscale;

/**
 * jQuery Autoscale Plugin
 * @param options
 * @returns {*}
 */
$.fn.autoscale = function(options) {
  return this.each(function() {
    new Autoscale(this, options);
  });
};

/**
 * Initialize Data Attribute
 */
$(document).on('ready.aranja', function() {
  $('[data-autoscale]').each(function() {
    $(this).autoscale($(this).data());
  });
});

},{}]},{},[1])