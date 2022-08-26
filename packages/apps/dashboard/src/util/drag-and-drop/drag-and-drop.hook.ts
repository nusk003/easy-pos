export const reorder = <T extends Array<any>>(
  list: T,
  startIndex: number,
  endIndex: number
): T => {
  const [removed] = list.splice(startIndex, 1);
  list.splice(endIndex, 0, removed);
  return list;
};
