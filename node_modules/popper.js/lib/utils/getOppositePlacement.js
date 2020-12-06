const hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
export default (placement => placement.replace(/left|right|bottom|top/g, matched => hash[matched]));