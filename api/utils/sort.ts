// Note: referenceArray can be an array of objects with an id property or an array of
// id strings. The unsortedArray must be an array of objects with an id property.
export const sortByReferenceArray = (
  referenceArray: { id: string }[] | string[],
  unsortedArray: { id: string }[],
) => {
  const referenceMap = referenceArray.reduce(
    (map: Record<string, number>, libraryItem, index) => {
      map[typeof libraryItem === "string" ? libraryItem : libraryItem.id] =
        index;
      return map;
    },
    {},
  );

  return unsortedArray.sort((a, b) => referenceMap[a.id] - referenceMap[b.id]);
};
