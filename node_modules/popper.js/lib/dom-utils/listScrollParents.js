import getScrollParent from './getScrollParent';
import getParentNode from './getParentNode';
export default function listScrollParents(element, list = []) {
  const scrollParent = getScrollParent(element);
  const isBody = scrollParent.nodeName === 'BODY';
  const target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  const updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}