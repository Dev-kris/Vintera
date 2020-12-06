export const top = 'top';
export const bottom = 'bottom';
export const right = 'right';
export const left = 'left';
export const auto = 'auto';
export const basePlacements = [top, bottom, right, left];
export const start = 'start';
export const end = 'end';
export const placements = basePlacements.reduce((acc, placement) => acc.concat([placement, `${placement}-${start}`, `${placement}-${end}`]), []); // modifiers that need to read the DOM

export const read = 'read'; // pure-logic modifiers

export const main = 'main'; // modifier with the purpose to write to the DOM (or write into a framework state)

export const write = 'write';