function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// DOM Utils
import getElementClientRect from './dom-utils/getElementClientRect';
import listScrollParents from './dom-utils/listScrollParents';
import getWindow from './dom-utils/getWindow';
import getNodeScroll from './dom-utils/getNodeScroll';
import getOffsetParent from './dom-utils/getOffsetParent';
import getCommonTotalScroll from './dom-utils/getCommonTotalScroll'; // Pure Utils

import unwrapJqueryElement from './utils/unwrapJqueryElement';
import orderModifiers from './utils/orderModifiers';
import expandEventListeners from './utils/expandEventListeners';
import computeOffsets from './utils/computeOffsets';
import format from './utils/format';
import debounce from './utils/debounce';
import validateModifiers from './utils/validateModifiers'; // Default modifiers

import * as modifiers from './modifiers/index';
const defaultModifiers = Object.values(modifiers);
const INVALID_ELEMENT_ERROR = 'Invalid `%s` argument provided to Popper.js, it must be either a valid DOM element or a jQuery-wrapped DOM element, you provided `%s`';

const areValidElements = (a, b) => a instanceof Element && b instanceof Element;

const defaultOptions = {
  placement: 'bottom',
  eventListeners: {
    scroll: true,
    resize: true
  },
  modifiers: [],
  strategy: 'absolute'
};
export default class Popper {
  constructor(reference, popper, options = defaultOptions) {
    _defineProperty(this, "state", {
      placement: 'bottom',
      orderedModifiers: [],
      options: defaultOptions
    });

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this)); // Unwrap `reference` and `popper` elements in case they are
    // wrapped by jQuery, otherwise consume them as is

    this.state.elements = {
      reference: unwrapJqueryElement(reference),
      popper: unwrapJqueryElement(popper)
    };
    const {
      reference: referenceElement,
      popper: popperElement
    } = this.state.elements; // Store options into state

    this.state.options = _objectSpread({}, defaultOptions, options); // Cache the placement in cache to make it available to the modifiers
    // modifiers will modify this one (rather than the one in options)

    this.state.placement = options.placement; // Don't proceed if `reference` or `popper` are invalid elements

    if (!areValidElements(referenceElement, popperElement)) {
      return;
    }

    this.state.scrollParents = {
      reference: listScrollParents(referenceElement),
      popper: listScrollParents(popperElement)
    }; // Order `options.modifiers` so that the dependencies are fulfilled
    // once the modifiers are executed

    this.state.orderedModifiers = orderModifiers([...defaultModifiers, ...this.state.options.modifiers]); // Validate the provided modifiers so that the consumer will get warned
    // of one of the custom modifiers is invalid for any reason

    if (process.env.NODE_ENV !== 'production') {
      validateModifiers(this.state.options.modifiers);
    } // Modifiers have the opportunity to execute some arbitrary code before
    // the first update cycle is ran, the order of execution will be the same
    // defined by the modifier dependencies directive.
    // The `onLoad` function may add or alter the options of themselves


    this.state.orderedModifiers.forEach(({
      onLoad,
      enabled
    }) => enabled && onLoad && onLoad(this.state));
    this.update().then(() => {
      // After the first update completed, enable the event listeners
      this.enableEventListeners(this.state.options.eventListeners);
    });
  } // Async and optimistically optimized update
  // it will not be executed if not necessary
  // check Popper#constructor to see how it gets debounced


  update() {
    return new Promise((success, reject) => {
      this.forceUpdate();
      success(this.state);
    });
  } // Syncronous and forcefully executed update
  // it will always be executed even if not necessary, usually NOT needed
  // use Popper#update instead


  forceUpdate() {
    const {
      reference: referenceElement,
      popper: popperElement
    } = this.state.elements; // Don't proceed if `reference` or `popper` are not valid elements anymore

    if (!areValidElements(referenceElement, popperElement)) {
      return;
    } // Get initial measurements
    // these are going to be used to compute the initial popper offsets
    // and as cache for any modifier that needs them later


    this.state.measures = {
      reference: getElementClientRect(referenceElement),
      popper: getElementClientRect(popperElement)
    }; // Get scrollTop and scrollLeft of the offsetParent
    // this will be used in the `computeOffsets` function to properly
    // position the popper taking in account the scroll position
    // FIXME: right now we only look for a single offsetParent (the popper one)
    //        but we really want to take in account the reference offsetParent as well

    const offsetParentScroll = getNodeScroll(getOffsetParent(popperElement)); // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step

    this.state.offsets = {
      popper: computeOffsets({
        reference: this.state.measures.reference,
        popper: this.state.measures.popper,
        strategy: 'absolute',
        placement: this.state.options.placement,
        scroll: getCommonTotalScroll(referenceElement, this.state.scrollParents.reference, this.state.scrollParents.popper)
      })
    }; // Modifiers have the ability to read the current Popper.js state, included
    // the popper offsets, and modify it to address specifc cases

    this.state = this.state.orderedModifiers.reduce((state, {
      fn,
      enabled,
      options
    }) => {
      if (enabled && typeof fn === 'function') {
        state = fn(this.state, options);
      }

      return state;
    }, this.state);
  }

  enableEventListeners(eventListeners) {
    const {
      reference: referenceElement,
      popper: popperElement
    } = this.state.elements;
    const {
      scroll,
      resize
    } = expandEventListeners(eventListeners);

    if (scroll) {
      const scrollParents = [...this.state.scrollParents.reference, ...this.state.scrollParents.popper];
      scrollParents.forEach(scrollParent => scrollParent.addEventListener('scroll', this.update, {
        passive: true
      }));
    }

    if (resize) {
      const win = getWindow(this.state.elements.popper);
      win && win.addEventListener('resize', this.update, {
        passive: true
      });
    }
  }

}