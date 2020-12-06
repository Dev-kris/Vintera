import getWindow from './getWindow';
export default function getOffsetParent(element) {
  const offsetParent = element instanceof HTMLElement ? element.offsetParent : null;
  const window = getWindow(element);

  if (offsetParent && offsetParent.nodeName && offsetParent.nodeName.toUpperCase() === 'BODY') {
    return window;
  }

  return offsetParent || window;
}