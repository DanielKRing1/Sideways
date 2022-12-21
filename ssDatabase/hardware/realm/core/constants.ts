const DELIM = '_';
export const genInputGraphName = (sliceName: string) =>
  `${sliceName}${DELIM}INPUT`;
export const genCategoryGraphName = (sliceName: string) =>
  `${sliceName}${DELIM}CATEGORY`;
export const getSliceNameFromGraphName = (graphName: string) => {
  const end: number = graphName.lastIndexOf(DELIM);
  return graphName.slice(0, end);
};
