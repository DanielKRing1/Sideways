import RealmGraphManager, { RealmGraph, RatingMode, RankedNode } from '@asianpersonn/realm-graph';
import RealmStackManager, { RealmStack, RSSnapshot, COLUMN_NAME_SNAPSHOT_TIMESTAMP as TIMESTAMP_COLUMN_KEY } from '@asianpersonn/realm-stack';
import {
    DEFAULT_REALM_STACK_META_REALM_PATH,
    DEFAULT_REALM_STACK_LOADABLE_REALM_PATH,
    DEFAULT_REALM_GRAPH_META_REALM_PATH,
    DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH
} from './config';

import { Dict } from '../../global';

// VARIABLES
let isLoaded = false;

// LOAD STACK AND GRAPH ----

const load = async () => {
    if(isLoaded) return;

    const graphPromise = await RealmGraphManager.loadGraphs(DEFAULT_REALM_GRAPH_META_REALM_PATH, DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH);
    const stackPromise = await RealmStackManager.loadStacks(DEFAULT_REALM_STACK_META_REALM_PATH, DEFAULT_REALM_STACK_LOADABLE_REALM_PATH);

    await Promise.all([graphPromise, stackPromise]);

    isLoaded = true;
};

const throwLoadError = () => {
    if(!isLoaded) throw new Error('Must call "load()" before RealmStack and RealmGraph can be used');
};

// SLICES AND THEIR PROPERTIES ----

const getSliceNames = (): string[] => {
    throwLoadError();

    return RealmGraphManager.getAllLoadedGraphNames();

    // return RealmStack.getStackNames(DEFAULT_REALM_STACK_META_REALM_PATH,DEFAULT_REALM_STACK_LOADABLE_REALM_PATH);
};
const getSlicePropertyNames = (sliceName: string): string[] => {
    throwLoadError();

    return RealmGraphManager.getGraph(sliceName).getPropertyNames();

    // return RealmStack.getStackProperties(DEFAULT_REALM_STACK_META_REALM_PATH, sliceName);
};

const getSliceProperties = (sliceName: string): Dict<any> => {
    const realmStack: RealmStack | undefined = RealmStackManager.getStack(sliceName);

    return realmStack !== undefined ? realmStack.getProperties() : {};
}

/**
 * 
 * @returns List of { sliceName, lsatLogged: last time this slice was logged }, sorted by descending recency
 */
const getLastLoggedSlices = async (): Promise<ExistingSlice[]> => {
    const existingSliceNames: string[] = getSliceNames();

    // console.log('EXISTING SLICE NAMES');
    // console.log(existingSliceNames);

    let existingSlices: ExistingSlice[] = []
    for(let sliceName of existingSliceNames) {
        const stack: StackSnapshotRow[] = await getStack(sliceName);
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
const createStack = async (stackName: string) => {
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
const getStack = async (stackName: string): Promise<StackSnapshotRow[]> => {
    throwLoadError();

    const realmStack: RealmStack | never = RealmStackManager.getStack(stackName);
    return await (realmStack.getList()) as StackSnapshotRow[];
};
// PUSH ONTO STACK
const pushOntoStack = (stackName: string, ...snapshots: Dict<any>[]) => {
    throwLoadError();

    RealmStackManager.getStack(stackName).push({}, ...snapshots);
};
// SEARCH STACK
const searchStack = async (stackName: string, date: Date): Promise<number> => {
    throwLoadError();

    const closestIndexOlderOrEqual: number = await RealmStackManager.getStack(stackName).getClosestDate(date);
    console.log(closestIndexOlderOrEqual);

    return closestIndexOlderOrEqual;
};

// REALM GRAPH

// CREATE A SINGLE GRAPH
const createGraph = async (graphName: string, propertyNames: string[]) => {
    throwLoadError();

    await RealmGraphManager.createGraph({
        metaRealmPath: DEFAULT_REALM_GRAPH_META_REALM_PATH,
        loadableRealmPath: DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH,
        graphName: graphName,
        propertyNames: propertyNames,
    });
};

// ADD GRAPH RATING
const rateGraph = async (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights: number[]): Promise<boolean> => {
    throwLoadError();

    const realmGraph: RealmGraph = RealmGraphManager.getGraph(graphName);

    realmGraph.rate(outputProperty, inputProperties, rating, weights, RatingMode.Single);
    realmGraph.rate(outputProperty, inputProperties, rating, weights, RatingMode.Collective);

    return true;
};
const undoRateGraph = async (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights: number[]): Promise<boolean> => {
    throwLoadError();

    rating *= -1;
    weights = weights.map((weight: number) => -1 * weight);

    return rateGraph(graphName, outputProperty, inputProperties, rating, weights);
};
const pageRank = async (graphName: string, iterations?: number, dampingFactor?: number): Promise<Dict<Dict<number>>> | never => {
    throwLoadError();

    const realmGraph: RealmGraph = await RealmGraphManager.getGraph(graphName);
    return realmGraph.pageRank(iterations, dampingFactor);
};
// GET GRAPH RECOMMENDATIONS
const getRecommendations = async (graphName: string, desiredOutput: string, inputNodeIds: string[], targetInputNodeWeight: number, edgeInflationMagnitude: number, iterations?: number, dampingFactor?: number): Promise<RankedNode[]> | never => {
    throwLoadError();

    const realmGraph: RealmGraph = await RealmGraphManager.getGraph(graphName);
    return realmGraph.recommend(desiredOutput, inputNodeIds, targetInputNodeWeight, edgeInflationMagnitude, iterations, dampingFactor);
};

const Driver: DriverType = {
    isLoaded,
    load,
    getSliceNames,
    getSlicePropertyNames,
    getSliceProperties,
    getLastLoggedSlices,

    createStack,
    getStack,
    pushOntoStack,
    searchStack,

    createGraph,
    rateGraph,
    undoRateGraph,
    pageRank,
    getRecommendations,
};

export default Driver;
