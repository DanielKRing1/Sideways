import RealmGraphManager, { RealmGraph, RatingMode } from '@asianpersonn/realm-graph';
import RealmStack from '@asianpersonn/realm-stack';
import {
    DEFAULT_REALM_STACK_META_REALM_PATH,
    DEFAULT_REALM_STACK_LOADABLE_REALM_PATH,
    DEFAULT_REALM_GRAPH_META_REALM_PATH,
    DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH
} from './config';

import { RankedNode } from '@asianpersonn/realm-graph/dist/types/RealmGraph';
import { Dict } from '../../global';

// VARIABLES
let isLoaded = false;

// LOAD STACK AND GRAPH ----

const load = async () => {
    if(isLoaded) return;

    const graphPromise = await RealmGraphManager.loadGraphs(DEFAULT_REALM_GRAPH_META_REALM_PATH, DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH);
    const stackPromise = await RealmStack.realmCache.loadStacks(DEFAULT_REALM_STACK_META_REALM_PATH, DEFAULT_REALM_STACK_LOADABLE_REALM_PATH);

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
const getSliceProperties = (sliceName: string): string[] => {
    throwLoadError();

    return RealmGraphManager.getGraph(sliceName).getGraphProperties();
    // return RealmStack.getStackProperties(DEFAULT_REALM_STACK_META_REALM_PATH, sliceName);
};

/**
 * 
 * @returns List of { sliceName, lsatLogged: last time this slice was logged }, sorted by descending recency
 */
const getLastLoggedSlices = (): ExistingSlice[] => {
    const existingSliceNames: string[] = getSliceNames();

    // console.log('EXISTING SLICE NAMES');
    // console.log(existingSliceNames);

    const a = existingSliceNames.map((sliceName: string) => {
        console.log(getStack(sliceName));
        const stack: StackSnapshotRow[] = getStack(sliceName);

            return ({
            sliceName,
            lastLogged: stack.length > 0 ? stack[0][RealmStack.TIMESTAMP_COLUMN_KEY] as Date : new Date(),
        })
    }).sort(({ lastLogged: lastLoggedA }, { lastLogged: lastLoggedB }) => lastLoggedB.getTime() - lastLoggedA.getTime());

    console.log('GET LAST LOGGED SLICES');
    console.log(a);

    return a;
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

    await RealmStack.realmCache.createStack({
        metaRealmPath: DEFAULT_REALM_STACK_META_REALM_PATH,
        stackRealmPath: DEFAULT_REALM_STACK_LOADABLE_REALM_PATH,
        stackName: stackName,
        snapshotProperties: DEFAULT_SNAPSHOT_PROPERTIES,
    });
};
// READ STACK
export type StackSnapshotRow = Dict<string | number | Date> & {
    // @ts-ignore
    [RealmStack.TIMESTAMP_COLUMN_KEY]: Date;
};
const getStack = (stackName: string): StackSnapshotRow[] => {
    throwLoadError();

    const stackObj: any = RealmStack.getStack(stackName);
    const stack: StackSnapshotRow[] = stackObj.list;

    return stack;
};
// PUSH ONTO STACK
const pushOntoStack = (stackName: string, ...snapshots: Dict<any>[]) => {
    throwLoadError();

    RealmStack.pushOntoStack({
    stackName, 
    }, ...snapshots);
};
// SEARCH STACK
const searchStack = (stackName: string, date: Date) => {
    throwLoadError();

    const closestIndexOlderOrEqual: number = RealmStack.getClosestDate(stackName, date);
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
const getGraph = (graphName: string): RealmGraph | undefined => {
    throwLoadError();

    return RealmGraphManager.getGraph(graphName);
};
// ADD GRAPH RATING
const rateGraph = async (graphName: string, outputProperty: string, inputProperties: string[], rating: number, weights: number[]): Promise<boolean> => {
    throwLoadError();

    const realmGraph: RealmGraph | undefined = await getGraph(graphName);
    if(!realmGraph) return false;

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
const pageRank = async (graphName: string, iterations?: number, dampingFactor?: number) => {
    throwLoadError();

    const realmGraph: RealmGraph | undefined = await getGraph(graphName);
    if(!realmGraph) return false;

    return realmGraph.pageRank(iterations, dampingFactor);
};
// GET GRAPH RECOMMENDATIONS
const getRecommendations = async (graphName: string, desiredOutput: string, inputNodeIds: string[], targetInputNodeWeight: number, edgeInflationMagnitude: number, iterations?: number, dampingFactor?: number) => {
    throwLoadError();

    const realmGraph: RealmGraph | undefined = await getGraph(graphName);
    if(!realmGraph) return false;

    return realmGraph.recommend(desiredOutput, inputNodeIds, targetInputNodeWeight, edgeInflationMagnitude, iterations, dampingFactor);
};

const Driver: DriverType = {
    isLoaded,
    load,
    getSliceNames,
    getSliceProperties,
    getLastLoggedSlices,

    createStack,
    getStack,
    pushOntoStack,
    searchStack,

    createGraph,
    getGraph,
    rateGraph,
    undoRateGraph,
    pageRank,
    getRecommendations,
};

export default Driver;
