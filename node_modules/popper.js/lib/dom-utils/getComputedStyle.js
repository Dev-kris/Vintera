import getWindow from './getWindow';
export default function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}