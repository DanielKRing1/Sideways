import RealmGraphManager, {
  RealmGraph,
  RatingMode,
  genEdgeName,
  CGNode,
  CGEdge,
} from '@asianpersonn/realm-graph';
import RealmStackManager, {
  RealmStack,
  COLUMN_NAME_SNAPSHOT_TIMESTAMP as TIMESTAMP_COLUMN_KEY,
  RealmStackRow,
} from '@asianpersonn/realm-stack';

import {
  DEFAULT_REALM_STACK_META_REALM_PATH,
  DEFAULT_REALM_STACK_LOADABLE_REALM_PATH,
  DEFAULT_REALM_GRAPH_META_REALM_PATH,
  DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH,
} from './config';

import {Dict} from '../../../../global';
import {
  ExistingSlice,
  SidewaysSnapshotRow,
  DbDriverType,
  SidewaysSnapshotRowWOTime,
  GraphType,
} from 'ssDatabase/api/core/types';
import {DEFAULT_SNAPSHOT_PROPERTIES} from './schemas';
import {
  genCategoryGraphName,
  genGraphName,
  genInputGraphName,
} from './constants';
import {NODE_ID} from 'ssDatabase/api/types';

// VARIABLES
let isLoaded = false;

// LOAD STACK AND GRAPH ----

const load = async (): Promise<void> => {
  if (isLoaded) return;

  const graphPromise: Promise<any> = RealmGraphManager.loadGraphs(
    DEFAULT_REALM_GRAPH_META_REALM_PATH,
    DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH,
  );
  const stackPromise: Promise<any> = RealmStackManager.loadStacks(
    DEFAULT_REALM_STACK_META_REALM_PATH,
    DEFAULT_REALM_STACK_LOADABLE_REALM_PATH,
  );

  await Promise.all([graphPromise, stackPromise]);

  isLoaded = true;
};

const closeAll = async (): Promise<void> => {
  const graphPromise: Promise<any> = RealmGraphManager.closeAllGraphs();
  const stackPromise: Promise<any> = RealmStackManager.closeAllStacks();

  await Promise.all([graphPromise, stackPromise]);

  isLoaded = false;
};

export const throwLoadError = (): void | never => {
  if (!isLoaded)
    throw new Error(
      'Must call "load()" before RealmStack or RealmGraph can be used',
    );
};

// SLICES AND THEIR PROPERTIES ----

const getSliceNames = (): string[] | never => {
  throwLoadError();

  return RealmStackManager.getAllLoadedStackNames();

  // return RealmStack.getStackNames(DEFAULT_REALM_STACK_META_REALM_PATH,DEFAULT_REALM_STACK_LOADABLE_REALM_PATH);
};
const getSlicePropertyNames = (sliceName: string): string[] | never => {
  throwLoadError();

  return RealmGraphManager.getGraph(
    genInputGraphName(sliceName),
  ).getPropertyNames();

  // return RealmStack.getStackProperties(DEFAULT_REALM_STACK_META_REALM_PATH, sliceName);
};

// TODO!!!! NOTICE THAT: This returns the snapshot properties, not the output property options
const getSliceProperties = (sliceName: string): Dict<any> | never => {
  const realmStack: RealmStack | undefined =
    RealmStackManager.getStack(sliceName);

  return realmStack !== undefined ? realmStack.getProperties() : {};
};

/**
 *
 * @returns List of { sliceName, lsatLogged: last time this slice was logged }, sorted by descending recency
 */
const getLastLoggedSlices = async (): Promise<ExistingSlice[]> | never => {
  const existingSliceNames: string[] = getSliceNames();

  // console.log('EXISTING SLICE NAMES');
  // console.log(existingSliceNames);

  let existingSlices: ExistingSlice[] = [];
  for (let sliceName of existingSliceNames) {
    const stack: Realm.List<SidewaysSnapshotRow> | [] = await getStack(
      sliceName,
    );
    existingSlices.push({
      sliceName,
      lastLogged:
        stack.length > 0 ? (stack[0][TIMESTAMP_COLUMN_KEY] as Date) : undefined,
    });
  }

  existingSlices.sort((sliceA, sliceB) => {
    const {sliceName: sliceNameA, lastLogged: lastLoggedA} = sliceA;
    const {sliceName: sliceNameB, lastLogged: lastLoggedB} = sliceB;

    if (lastLoggedA === undefined && lastLoggedB === undefined)
      return sliceNameA.localeCompare(sliceNameB);
    if (lastLoggedA === undefined) return 1;
    if (lastLoggedB === undefined) return -1;

    return lastLoggedB.getTime() - lastLoggedA.getTime();
  });

  console.log('GET LAST LOGGED SLICES');
  console.log(existingSlices);

  return existingSlices;
};

// REALM STACK

// CREATE SINGLE STACK
const createStack = async (stackName: string): Promise<void> | never => {
  throwLoadError();

  await RealmStackManager.createStack({
    metaRealmPath: DEFAULT_REALM_STACK_META_REALM_PATH,
    loadableRealmPath: DEFAULT_REALM_STACK_LOADABLE_REALM_PATH,
    stackName: stackName,
    snapshotProperties: DEFAULT_SNAPSHOT_PROPERTIES,
  });
};

// READ STACK
const getStack = async (
  stackName: string,
): Promise<Realm.List<SidewaysSnapshotRow> | []> | never => {
  throwLoadError();

  // 1. Get RealmStack
  const realmStack: RealmStack | never = RealmStackManager.getStack(stackName);

  // 2. Get RealmStackRow
  const stackRow: (RealmStackRow & Realm.Object) | undefined =
    await realmStack.getStackRow();
  if (stackRow === undefined) return [];

  return stackRow.list as unknown as Realm.List<SidewaysSnapshotRow>;
};
const getList = async (
  stackName: string,
): Promise<SidewaysSnapshotRow[]> | never => {
  throwLoadError();

  const list: SidewaysSnapshotRow[] | never = (await RealmStackManager.getStack(
    stackName,
  ).getListJSON()) as SidewaysSnapshotRow[];
  return list;
};

// SEARCH STACK
const searchStack = async (
  stackName: string,
  date: Date,
): Promise<number> | never => {
  throwLoadError();

  const closestIndexOlderOrEqual: number = await RealmStackManager.getStack(
    stackName,
  ).getClosestDate(date);
  console.log(closestIndexOlderOrEqual);

  return closestIndexOlderOrEqual;
};

// UPDATE (PUSH ONTO) STACK
const push = (
  stackName: string,
  ...snapshots: SidewaysSnapshotRowWOTime[]
): void | never => {
  throwLoadError();

  RealmStackManager.getStack(stackName).push({}, ...snapshots);
};

// DELETE STACK
const deleteStack = async (stackName: string): Promise<void> | never => {
  throwLoadError();

  await RealmStackManager.getStack(stackName).deleteStack();
};

const setSnapshotInputs = async (
  stackName: string,
  index: number,
  inputs: string[],
): Promise<void> | never => {
  throwLoadError();

  const stack: (RealmStackRow & Realm.Object) | undefined =
    await RealmStackManager.getStack(stackName).getStackRow();
  if (stack === undefined) return;

  const entry: Realm.Object & SidewaysSnapshotRow = stack.list[
    index
  ] as unknown as Realm.Object & SidewaysSnapshotRow;
  entry.inputs = inputs;
};
const rmSnapshotInputs = async (
  stackName: string,
  index: number,
  inputsToRm: Set<string>,
): Promise<void> | never => {
  throwLoadError();

  const stack: (RealmStackRow & Realm.Object) | undefined =
    await RealmStackManager.getStack(stackName).getStackRow();
  if (stack === undefined) return;

  const entry: Realm.Object & SidewaysSnapshotRow = stack.list[
    index
  ] as unknown as Realm.Object & SidewaysSnapshotRow;
  const inputsToKeep: string[] = entry.inputs.filter(
    input => !inputsToRm.has(input),
  );
  entry.inputs = inputsToKeep;
};
const setSnapshotOutputs = async (
  stackName: string,
  index: number,
  outputs: string[],
): Promise<void> | never => {
  throwLoadError();

  const stack: (RealmStackRow & Realm.Object) | undefined =
    await RealmStackManager.getStack(stackName).getStackRow();
  if (stack === undefined) return;

  const entry: Realm.Object & SidewaysSnapshotRow = stack.list[
    index
  ] as unknown as Realm.Object & SidewaysSnapshotRow;
  entry.outputs = outputs;
};
const rmSnapshotOutputs = async (
  stackName: string,
  index: number,
  outputsToRm: Set<string>,
): Promise<void> | never => {
  throwLoadError();

  const stack: (RealmStackRow & Realm.Object) | undefined =
    await RealmStackManager.getStack(stackName).getStackRow();
  if (stack === undefined) return;

  const entry: Realm.Object & SidewaysSnapshotRow = stack.list[
    index
  ] as unknown as Realm.Object & SidewaysSnapshotRow;
  const outputsToKeep: string[] = entry.outputs.filter(
    output => !outputsToRm.has(output),
  );
  entry.outputs = outputsToKeep;
};

const updateSnapshot = async (
  sliceName: string,
  index: number,
  newInputs: string[],
  newOutputs: string[],
  newRating: number,
): Promise<void> | never => {
  throwLoadError();

  // 1. Get realm
  const realm: Realm = await RealmStackManager.getStack(sliceName).loadRealm();
  const realmSnapshot = (
    await RealmStackManager.getStack(sliceName).getAllSnapshots()
  )[index];

  // 2. Update old snapshot Realm Object
  realm.write(() => {
    realmSnapshot.inputs = newInputs;
    realmSnapshot.outputs = newOutputs;
    realmSnapshot.rating = newRating;
  });
};

const deleteSnapshotIndexes = async (
  stackName: string,
  indexesToRm: number[],
): Promise<void> | never => {
  throwLoadError();

  await RealmStackManager.getStack(stackName).deleteIndexes(indexesToRm);
};

// REALM GRAPH

// CREATE A SINGLE GRAPH
const createGraphs = async (
  sliceName: string,
  outputNames: string[],
): Promise<void> | never => {
  throwLoadError();

  await RealmGraphManager.createGraph({
    metaRealmPath: DEFAULT_REALM_GRAPH_META_REALM_PATH,
    loadableRealmPath: DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH,
    graphName: genInputGraphName(sliceName),
    propertyNames: outputNames,
  });

  await RealmGraphManager.createGraph({
    metaRealmPath: DEFAULT_REALM_GRAPH_META_REALM_PATH,
    loadableRealmPath: DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH,
    graphName: genCategoryGraphName(sliceName),
    propertyNames: outputNames,
  });
};

// READ GRAPH
const getGraph = (sliceName: string, graphType: GraphType) => {
  const graphName: string = genGraphName(sliceName, graphType);
  const realmGraph: RealmGraph | never = RealmGraphManager.getGraph(graphName);

  return realmGraph;
};
const getNode = (
  sliceName: string,
  nodeId: NODE_ID,
  graphType: GraphType = GraphType.Input,
): (Realm.Object & CGNode) | undefined | never => {
  throwLoadError();

  const realmGraph: RealmGraph | never = getGraph(sliceName, graphType);

  return realmGraph.getNode(nodeId);
};
const getEdge = (
  sliceName: string,
  node1Id: NODE_ID,
  node2Id: NODE_ID,
  graphType: GraphType = GraphType.Input,
): (Realm.Object & CGEdge) | undefined | never => {
  throwLoadError();

  const realmGraph: RealmGraph | never = getGraph(sliceName, graphType);

  const edgeId: string = genEdgeName(node1Id, node2Id);
  return realmGraph.getEdge(edgeId);
};
const getAllNodes = (
  sliceName: string,
  graphType: GraphType = GraphType.Input,
): Realm.Results<Realm.Object & CGNode> | [] | never => {
  throwLoadError();

  const realmGraph: RealmGraph | never = getGraph(sliceName, graphType);

  return realmGraph.getAllNodes();
};
const getAllEdges = (
  sliceName: string,
  graphType: GraphType = GraphType.Input,
): Realm.Results<Realm.Object & CGEdge> | [] | never => {
  throwLoadError();

  const realmGraph: RealmGraph | never = getGraph(sliceName, graphType);

  return realmGraph.getAllEdges();
};

// UPDATE / ADD GRAPH RATING
const rateGraph = async (
  sliceName: string,
  outputProperty: string,
  inputProperties: string[],
  rating: number,
  weights: number[] = new Array(inputProperties.length).fill(
    1 / inputProperties.length,
  ),
  graphType: GraphType = GraphType.Input,
): Promise<boolean> | never => {
  throwLoadError();

  const realmGraph: RealmGraph | never = getGraph(sliceName, graphType);

  realmGraph.rate(
    outputProperty,
    inputProperties,
    rating,
    weights,
    RatingMode.Single,
  );
  realmGraph.rate(
    outputProperty,
    inputProperties,
    rating,
    weights,
    RatingMode.Collective,
  );

  return true;
};
const undoRateGraph = async (
  sliceName: string,
  outputProperty: string,
  inputProperties: string[],
  rating: number,
  weights: number[] = new Array(inputProperties.length).fill(
    1 / inputProperties.length,
  ),
  graphType: GraphType = GraphType.Input,
): Promise<boolean> | never => {
  throwLoadError();

  const realmGraph: RealmGraph | never = getGraph(sliceName, graphType);

  realmGraph.rate(
    outputProperty,
    inputProperties,
    rating,
    weights,
    RatingMode.Single,
  );
  realmGraph.rate(
    outputProperty,
    inputProperties,
    rating,
    weights,
    RatingMode.Collective,
  );

  return true;
};

// DELETE GRAPH
const deleteGraphs = async (sliceName: string): Promise<void> | never => {
  throwLoadError();

  getGraph(sliceName, GraphType.Input).deleteGraph();
  getGraph(sliceName, GraphType.Category).deleteGraph();
};

const Driver: DbDriverType = {
  isLoaded,
  load,
  closeAll,

  getSliceNames,
  getSlicePropertyNames,
  getSliceProperties,
  getLastLoggedSlices,

  createStack,
  getStack,
  getList,
  searchStack,
  push,
  deleteStack,

  updateSnapshot,
  deleteSnapshotIndexes,

  createGraphs,
  getGraph,
  getNode,
  getAllNodes,
  getEdge,
  getAllEdges,
  deleteGraphs,
  rateGraph,
  undoRateGraph,
};

export default Driver;
