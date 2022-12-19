import {CGNode, CGEdge} from '@asianpersonn/realm-graph';
import {Dict} from '../../../global';

export enum GraphType {
  Input,
  Category,
}

export type ExistingSlice = {sliceName: string; lastLogged: Date | undefined};

// REALM DB TYPES
export type SidewaysSnapshotRow = {
  inputs: string[];
  categories: string[];
  outputs: string[];
  rating: number;

  timestamp: Date;
};
export type SidewaysSnapshotRowWOTime = Omit<SidewaysSnapshotRow, 'timestamp'>;
export type SidewaysSnapshotRowPrimitive = SidewaysSnapshotRowWOTime & {
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
  push: (
    stackName: string,
    ...snapshots: SidewaysSnapshotRowWOTime[]
  ) => void | never;
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

  createGraphs: (
    sliceName: string,
    propertyNames: string[],
  ) => Promise<void> | never;
  getNode: (
    sliceName: string,
    nodeId: string,
    graphType?: GraphType,
  ) => (Realm.Object & CGNode) | undefined | never;
  getEdge: (
    sliceName: string,
    node1Id: string,
    node2Id: string,
    graphType?: GraphType,
  ) => (Realm.Object & CGEdge) | undefined | never;
  getAllNodes: (
    sliceName: string,
    graphType?: GraphType,
  ) => Realm.Results<Realm.Object & CGNode> | [] | never;
  getAllEdges: (
    sliceName: string,
    graphType?: GraphType,
  ) => Realm.Results<Realm.Object & CGEdge> | [] | never;
  deleteGraph: (
    sliceName: string,
    graphType?: GraphType,
  ) => Promise<void> | never;
  rateGraph: (
    sliceName: string,
    outputProperty: string,
    inputProperties: string[],
    rating: number,
    weights?: number[],
    graphType?: GraphType,
  ) => Promise<boolean> | never;
  undoRateGraph: (
    sliceName: string,
    outputProperty: string,
    inputProperties: string[],
    rating: number,
    weights?: number[],
    graphType?: GraphType,
  ) => Promise<boolean> | never;
};
