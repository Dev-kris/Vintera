export default function getWindow(node) {
  const ownerDocument = node.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}