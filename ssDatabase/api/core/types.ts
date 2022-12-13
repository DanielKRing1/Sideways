import {CGNode, CGEdge} from '@asianpersonn/realm-graph';
import {Dict} from '../../../global';

export type ExistingSlice = {sliceName: string; lastLogged: Date | undefined};

// REALM DB TYPES
export type SidewaysSnapshotRow = {
  inputs: string[];
  outputs: string[];
  rating: number;

  timestamp: Date;
};
export type SidewaysSnapshotRowPrimitive = Omit<
  SidewaysSnapshotRow,
  'timestamp'
> & {
  timestamp: number;
};

export type DbDriverType = {
  isLoaded: boolean;
  load: () => Promise<void>;
  closeAll: () => Promise<void>;

  getSliceNames: () => string[] | never;
  getSlicePropertyNames: (sliceName: string) => string[] | never;
  getSliceProperties: (sliceName: string) => Dict<any> | never;
  getLastLoggedSlices: () => Promise<ExistingSlice[]> | never;

  createStack: (stackName: string) => Promise<void> | never;
  getStack: (
    stackName: string,
  ) => Promise<Realm.List<SidewaysSnapshotRow> | []> | never;
  getList: (stackName: string) => Promise<SidewaysSnapshotRow[]> | never;
  searchStack: (stackName: string, date: Date) => Promise<number> | never;
  push: (stackName: string, ...snapshots: Dict<any>[]) => void | never;
  deleteStack: (stackName: string) => Promise<void> | never;

  deleteSnapshotIndexes: (
    stackName: string,
    indexesToRm: number[],
  ) => Promise<void> | never;
  updateSnapshot: (
    sliceName: string,
    index: number,
    newInputs: string[],
    newOutputs: string[],
    newRating: number,
  ) => Promise<void> | never;

  createGraph: (
    graphName: string,
    propertyNames: string[],
  ) => Promise<void> | never;
  getNode: (
    graphName: string,
    nodeId: string,
  ) => (Realm.Object & CGNode) | undefined | never;
  getEdge: (
    graphName: string,
    node1Id: string,
    node2Id: string,
  ) => (Realm.Object & CGEdge) | undefined | never;
  getAllNodes: (
    graphName: string,
  ) => Realm.Results<Realm.Object & CGNode> | [] | never;
  getAllEdges: (
    graphName: string,
  ) => Realm.Results<Realm.Object & CGEdge> | [] | never;
  deleteGraph: (graphName: string) => Promise<void> | never;
  rateGraph: (
    graphName: string,
    outputProperty: string,
    inputProperties: string[],
    rating: number,
    weights?: number[],
  ) => Promise<boolean> | never;
  undoRateGraph: (
    graphName: string,
    outputProperty: string,
    inputProperties: string[],
    rating: number,
    weights?: number[],
  ) => Promise<boolean> | never;
};
