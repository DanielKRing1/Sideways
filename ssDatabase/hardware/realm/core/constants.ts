import {GraphType} from 'ssDatabase/api/core/types';

const DELIM = '_';
const genInputGraphName = (sliceName: string) => `${sliceName}${DELIM}INPUT`;
const genCategoryGraphName = (sliceName: string) =>
  `${sliceName}${DELIM}CATEGORY`;

export const genGraphName = (
  sliceName: string,
  graphType: GraphType = GraphType.Input,
) => {
  switch (graphType) {
    case GraphType.Category:
      return genCategoryGraphName(sliceName);
    case GraphType.Input:
    default:
      return genInputGraphName(sliceName);
  }
};
export const getSliceNameFromGraphName = (graphName: string) => {
  const end: number = graphName.lastIndexOf(DELIM);
  return graphName.slice(0, end);
};
