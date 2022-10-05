import RealmGraphManager, { RealmGraph, RatingMode, RankedNode, genEdgeName, CGNode, CGEdge, ID_KEY } from '@asianpersonn/realm-graph';
import RealmStackManager, { RealmStack, RSSnapshot, COLUMN_NAME_SNAPSHOT_TIMESTAMP as TIMESTAMP_COLUMN_KEY, RealmStackRow } from '@asianpersonn/realm-stack';

import {
    DEFAULT_REALM_STACK_META_REALM_PATH,
    DEFAULT_REALM_STACK_LOADABLE_REALM_PATH,
    DEFAULT_REALM_GRAPH_META_REALM_PATH,
    DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH
} from './config';

import { Dict } from '../../global';
import { DbDriverType, ExistingSlice, SidewaysSnapshotRow } from '../types';

// VARIABLES
let isLoaded = false;

// LOAD STACK AND GRAPH ----

const load = async (): Promise<void> => {
    if(isLoaded) return;

    const graphPromise = await RealmGraphManager.loadGraphs(DEFAULT_REALM_GRAPH_META_REALM_PATH, DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH);
    const stackPromise = await RealmStackManager.loadStacks(DEFAULT_REALM_STACK_META_REALM_PATH, DEFAULT_REALM_STACK_LOADABLE_REALM_PATH);

    await Promise.all([graphPromise, stackPromise]);

    isLoaded = true;
};

const closeAll = async (): Promise<void> => {
    await RealmGraphManager.closeAllGraphs();
    await RealmStackManager.closeAllStacks();
}

export const throwLoadError = (): void | never => {
    if(!isLoaded) throw new Error('Must call "load()" before RealmStack or RealmGraph can be used');
};

// SLICES AND THEIR PROPERTIES ----

const getSliceNames = (): string[] | never => {
    throwLoadError();

    return RealmGraphManager.getAllLoadedGraphNames();

    // return RealmStack.getStackNames(DEFAULT_REALM_STACK_META_REALM_PATH,DEFAULT_REALM_STACK_LOADABLE_REALM_PATH);
};
const getSlicePropertyNames = (sliceName: string): string[] | never => {
    throwLoadError();

    return RealmGraphManager.getGraph(sliceName).getPropertyNames();

    // return RealmStack.getStackProperties(DEFAULT_REALM_STACK_META_REALM_PATH, sliceName);
};

const getSliceProperties = (sliceName: string): Dict<any> | never => {
    const realmStack: RealmStack | undefined = RealmStackManager.getStack(sliceName);

    return realmStack !== undefined ? realmStack.getProperties() : {};
}

/**
 * 
 * @returns List of { sliceName, lsatLogged: last time this slice was logged }, sorted by descending recency
 */
const getLastLoggedSlices = async (): Promise<ExistingSlice[]> | never => {
    const existingSliceNames: string[] = getSliceNames();

    // console.log('EXISTING SLICE NAMES');
    // console.log(existingSliceNames);

    let existingSlices: ExistingSlice[] = []
    for(let sliceName of existingSliceNames) {
        const stack: Realm.List<SidewaysSnapshotRow> | [] = await getStack(sliceName);
        existingSlices.push({
            sliceName,
            lastLogged: stack.length > 0 ? stack[0][TIMESTAMP_COLUMN_KEY] as Date : undefined,
        });
    }

    existingSlices.sort((sliceA, sliceB) => {
        const { sliceName: sliceNameA, lastLogged: lastLoggedA } = sliceA;
        const { sliceName: sliceNameB, lastLogged: lastLoggedB } = sliceB;

        if(lastLoggedA === undefined && lastLoggedB === undefined) return sliceNameA.localeCompare(sliceNameB);
        if(lastLoggedA === undefined) return 1;
        if(lastLoggedB === undefined) return -1;

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

    const DEFAULT_SNAPSHOT_PROPERTIES: Dict<string> = {
        inputs: 'string[]',
        outputs: 'string[]',
        rating: 'int',
      };

    await RealmStackManager.createStack({
        metaRealmPath: DEFAULT_REALM_STACK_META_REALM_PATH,
        loadableRealmPath: DEFAULT_REALM_STACK_LOADABLE_REALM_PATH,
        stackName: stackName,
        snapshotProperties: DEFAULT_SNAPSHOT_PROPERTIES,
    });
};

// READ STACK
const getStack = async (stackName: string): Promise<Realm.List<SidewaysSnapshotRow> | []> | never => {
    throwLoadError();

    // 1. Get RealmStack
    const realmStack: RealmStack | never = RealmStackManager.getStack(stackName);

    // 2. Get RealmStackRow
    const stackRow: (RealmStackRow & Realm.Object) | undefined = await realmStack.getStackRow();
    if(stackRow === undefined) return [];

    return stackRow.list as unknown as Realm.List<SidewaysSnapshotRow>;
};
const getList = async (stackName: string): Promise<SidewaysSnapshotRow[]> | never => {
    throwLoadError();

    const list: SidewaysSnapshotRow[] | never = (await RealmStackManager.getStack(stackName).getListJSON()) as SidewaysSnapshotRow[];
    return list;
};

// SEARCH STACK
const searchStack = async (stackName: string, date: Date): Promise<number> | never => {
    throwLoadError();

    const closestIndexOlderOrEqual: number = await RealmStackManager.getStack(stackName).getClosestDate(date);
    console.log(closestIndexOlderOrEqual);

    return closestIndexOlderOrEqual;
};

// UPDATE (PUSH ONTO) STACK
const push = (stackName: string, ...snapshots: Dict<any>[]): void | never => {
    throwLoadError();

    RealmStackManager.getStack(stackName).push({}, ...snapshots);
};

// DELETE STACK
const deleteStack = async (stackName: string): Promise<void> | never => {
    throwLoadError();

    await RealmStackManager.getStack(stackName).deleteStack();
};

const setSnapshotInputs = async (stackName: string, index: number, inputs: string[]): Promise<void> | never => {
    throwLoadError();
    
    const stack: (RealmStackRow & Realm.Object) | undefined = await RealmStackManager.getStack(stackName).getStackRow();
    if(stack === undefined) return;
    
    const entry: (Realm.Object & SidewaysSnapshotRow) = stack.list[index] as unknown as (Realm.Object & SidewaysSnapshotRow);
    entry.inputs = inputs;
};
const rmSnapshotInputs = async(stackName: string, index: number, inputsToRm: Set<string>): Promise<void> | never => {
    throwLoadError();

    const stack: (RealmStackRow & Realm.Object) | undefined = await RealmStackManager.getStack(stackName).getStackRow();
    if(stack === undefined) return;

    const entry: (Realm.Object & SidewaysSnapshotRow) = stack.list[index] as unknown as (Realm.Object & SidewaysSnapshotRow);
    const inputsToKeep: string[] = entry.inputs.filter((input) => !inputsToRm.has(input));
    entry.inputs = inputsToKeep;
}
const setSnapshotOutputs = async (stackName: string, index: number, outputs: string[]): Promise<void> | never => {
    throwLoadError();

    const stack: (RealmStackRow & Realm.Object) | undefined = await RealmStackManager.getStack(stackName).getStackRow();
    if(stack === undefined) return;

    const entry: (Realm.Object & SidewaysSnapshotRow) = stack.list[index] as unknown as (Realm.Object & SidewaysSnapshotRow);
    entry.outputs = outputs;
};
const rmSnapshotOutputs = async(stackName: string, index: number, outputsToRm: Set<string>): Promise<void> | never => {
    throwLoadError();

    const stack: (RealmStackRow & Realm.Object) | undefined = await RealmStackManager.getStack(stackName).getStackRow();
    if(stack === undefined) return;

    const entry: (Realm.Object & SidewaysSnapshotRow) = stack.list[index] as unknown as (Realm.Object & SidewaysSnapshotRow);
    const outputsToKeep: string[] = entry.outputs.filter((output) => !outputsToRm.has(output));
    entry.outputs = outputsToKeep;
}

const updateSnapshot = async(sliceName: string, oldSnapshot: Realm.Object & SidewaysSnapshotRow, newInputs: string[], newOutputs: string[], newRating: number): Promise<void> | never => {
    throwLoadError();

    // 1. Get realm
    const realm: Realm = await RealmStackManager.getStack(sliceName).loadRealm();

    // 2. Update old snapshot Realm Object
    realm.write(() => {
        oldSnapshot.inputs = newInputs;
        oldSnapshot.outputs = newOutputs;
        oldSnapshot.rating = newRating;
    });
}

const deleteSnapshotIndexes = async (stackName: string, indexesToRm: number[]): Promise<void> | never => {
    throwLoadError();

    await RealmStackManager.getStack(stackName).deleteIndexes(indexesToRm);
};

// REALM GRAPH

// CREATE A SINGLE GRAPH
const createGraph = async (graphName: string, propertyNames: string[]): Promise<void> | never => {
    throwLoadError();

    await RealmGraphManager.createGraph({
        metaRealmPath: DEFAULT_REALM_GRAPH_META_REALM_PATH,
        loadableRealmPath: DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH,
        graphName: graphName,
        propertyNames: propertyNames,
    });
};

// READ GRAPH
const getNode = (graphName: string, nodeId: string): Realm.Object & CGNode | undefined | never => {
    throwLoadError();

    const realmGraph: RealmGraph | never = RealmGraphManager.getGraph(graphName);

    return realmGraph.getNode(nodeId);
}
const getEdge = (graphName: string, node1Id: string, node2Id: string): Realm.Object & CGEdge | undefined | never => {
    throwLoadError();

    const realmGraph: RealmGraph | never = RealmGraphManager.getGraph(graphName);

    const edgeId: string = genEdgeName(node1Id, node2Id);
    return realmGraph.getEdge(edgeId);
}
const getAllNodes = (graphName: string): Realm.Results<Realm.Object & CGNode> | [] | never => {
    throwLoadError();

    const realmGraph: RealmGraph | never = RealmGraphManager.getGraph(graphName);

    return realmGraph.getAllNodes();
}
const getAllEdges = (graphName: string): Realm.Results<Realm.Object & CGEdge> | [] | never => {
    throwLoadError();

    const realmGraph: RealmGraph | never = RealmGraphManager.getGraph(graphName);

    return realmGraph.getAllEdges();
}


// UPDATE / ADD GRAPH RATING
const rateGraph = async (
    graphName: string,
    outputProperty: string,
    inputProperties: string[],
    rating: number,
    weights: number[]=new Array(inputProperties.length).fill(1/inputProperties.length)
    ): Promise<boolean> | never => {
        throwLoadError();
        
        const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);
        
        realmGraph.rate(outputProperty, inputProperties, rating, weights, RatingMode.Single);
        realmGraph.rate(outputProperty, inputProperties, rating, weights, RatingMode.Collective);
        
        return true;
    };
const undoRateGraph = async (
    graphName: string,
    outputProperty: string,
    inputProperties: string[],
    rating: number,
    weights: number[]=new Array(inputProperties.length).fill(1/inputProperties.length)
    ): Promise<boolean> | never => {
        throwLoadError();
        
        const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);
        
        realmGraph.rate(outputProperty, inputProperties, rating, weights, RatingMode.Single);
        realmGraph.rate(outputProperty, inputProperties, rating, weights, RatingMode.Collective);

    return true;
};

// DELETE GRAPH
const deleteGraph = async (graphName: string): Promise<void> | never => {
    throwLoadError();

    await RealmGraphManager.getGraph(graphName).deleteGraph();
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

    createGraph,
    getNode,
    getAllNodes,
    getEdge,
    getAllEdges,
    deleteGraph,
    rateGraph,
    undoRateGraph,
};

export default Driver;
