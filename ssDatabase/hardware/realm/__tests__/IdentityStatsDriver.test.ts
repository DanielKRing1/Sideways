// TODO!!!
// TEST nodeId = undefined

// @ts-ignore
import fs from 'fs';
// @ts-ignore
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// 0. Edit Realm Path Constants ---- START
const TEST_NAME: string = 'TimeseriesStatsDriver';
const mockTEST_DIRECTORY: string = `ssDatabase/realm/__tests__/${TEST_NAME}`;
if (fs.existsSync(mockTEST_DIRECTORY))
  fs.rmSync(mockTEST_DIRECTORY, {recursive: true});
fs.mkdirSync(mockTEST_DIRECTORY);

jest.mock(`ssDatabase/realm/core/config`, () => {
  return {
    // Need to type out exact file path; cannot use variable or value will be undefined
    DEFAULT_REALM_STACK_META_REALM_PATH: `ssDatabase/realm/__tests__/TimeseriesStatsDriver/REALM_STACK_META_REALM_PATH.path`,
    DEFAULT_REALM_STACK_LOADABLE_REALM_PATH: 'SIDEWAYS_STACKS.path',

    DEFAULT_REALM_GRAPH_META_REALM_PATH: `ssDatabase/realm/__tests__/TimeseriesStatsDriver/REALM_GRAPH_META_REALM_PATH.path`,
    DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH: 'SIDEWAYS_GRAPHS.path',
  };
});
// 0. Edit Realm Path Constants ---- END

// TO TEST
import dbDriver from '../../../api/core/dbDriver';
import {startCreateSlice} from '../../../../ssRedux/createSidewaysSlice';
import {startRate} from '../../../../ssRedux/rateSidewaysSlice';

import TimeseriesStatsDriver, {
  ChartBar,
  DailyOutput,
  HeatMapByMonth,
  HistogramByMonth,
  LineGraph,
  VennByMonth,
} from '../analytics/timeseriesStatsDriver';
import {GrowingIdText as NewSliceOutput} from '../../../../ssComponents/Input/GrowingIdList';
import {Dict} from '../../../../global';

// ALL AVAILABLE DATA
const TEST_SLICE_NAME: string = 'TestSlice';
const TEST_OUTPUTS_MAP: Dict<string> = {
  good: 'good',
  bad: 'bad',
};
const TEST_OUPUTS_ALL: string[] = Object.values(TEST_OUTPUTS_MAP).sort();
const TEST_GROWING_ID_TEXT_ALL: NewSliceOutput[] = TEST_OUPUTS_ALL.map(
  (output: string, i) => ({id: i, text: output}),
);
const TEST_NODES_MAP: Dict<string> = {
  basketball: 'basketball',
  eat: 'eat',
  run: 'run',
  sleep: 'sleep',
  walk: 'walk',
};
const TEST_NODES_ALL: string[] = Object.values(TEST_NODES_MAP).sort();

// RATING DATA
const TEST_RATE_1: {inputs: string[]; outputs: string[]; rating: number} = {
  inputs: TEST_NODES_ALL,
  outputs: TEST_OUPUTS_ALL,
  rating: 10,
};
const TEST_RATE_2: {inputs: string[]; outputs: string[]; rating: number} = {
  inputs: [TEST_NODES_MAP.eat, TEST_NODES_MAP.walk],
  outputs: [TEST_OUTPUTS_MAP.good],
  rating: 8,
};
const TEST_RATE_3: {inputs: string[]; outputs: string[]; rating: number} = {
  inputs: [TEST_NODES_MAP.basketball, TEST_NODES_MAP.run],
  outputs: [TEST_OUTPUTS_MAP.bad],
  rating: 6,
};
const TEST_RATE_4: {inputs: string[]; outputs: string[]; rating: number} = {
  inputs: [TEST_NODES_MAP.run, TEST_NODES_MAP.sleep],
  outputs: [TEST_OUTPUTS_MAP.bad],
  rating: 4,
};

// TIMESERIES STATS ARGS
const TEST_NODES_VENN: string[] = [
  TEST_NODES_ALL[0],
  TEST_NODES_ALL[1],
  TEST_NODES_ALL[3],
];

describe('TimeseriesStatsDriver', () => {
  beforeAll(async () => {
    // 1. Load Realm
    await dbDriver.load();

    // 2. Mock Redux
    let store;

    store = initStore({
      createSidewaysSlice: {
        newSliceName: TEST_SLICE_NAME,
        possibleOutputs: TEST_GROWING_ID_TEXT_ALL,
      },
    });

    // 3. Dispatch Thunk
    await store.dispatch(startCreateSlice());

    // 4. Rate 1
    store = initStore({
      readSidewaysSlice: {
        toplevelReadReducer: {
          activeSliceName: TEST_SLICE_NAME,
        },
      },
      rateSidewaysSlice: TEST_RATE_1,
    });
    await store.dispatch(startRate());

    // 5. Rate 2
    store = initStore({
      readSidewaysSlice: {
        toplevelReadReducer: {
          activeSliceName: TEST_SLICE_NAME,
        },
      },
      rateSidewaysSlice: TEST_RATE_2,
    });
    await store.dispatch(startRate());

    // 6. Rate 3
    store = initStore({
      readSidewaysSlice: {
        toplevelReadReducer: {
          activeSliceName: TEST_SLICE_NAME,
        },
      },
      rateSidewaysSlice: TEST_RATE_3,
    });
    await store.dispatch(startRate());

    // 7. Rate 4
    store = initStore({
      readSidewaysSlice: {
        toplevelReadReducer: {
          activeSliceName: TEST_SLICE_NAME,
        },
      },
      rateSidewaysSlice: TEST_RATE_4,
    });
    await store.dispatch(startRate());
  });

  // eat, walk, basketball, run, sleep | good, bad | 10
  // eat, walk | good | 8
  // basketball, run | bad | 6
  // run, sleep | bad | 4
  it('Should Get Daily Outputs for a Line Graph', async () => {
    const lineGraph: LineGraph = await TimeseriesStatsDriver.getDailyOutputLG({
      sliceName: TEST_SLICE_NAME,
      outputs: TEST_OUPUTS_ALL,
    });

    // RATING 4 [ bad ], RATING 3 [ bad ], RATING 2 [ good ], RATING 1 [ bad, good ]
    expect(
      lineGraph.map((snapshot: DailyOutput) => ({
        x: new Date(0),
        y: snapshot.y,
      })),
    ).toEqual([
      {x: new Date(0), y: 0},
      {x: new Date(0), y: 0},
      {x: new Date(0), y: 1},
      {x: new Date(0), y: 0},
      {x: new Date(0), y: 1},
    ]);
  });
  it('Should Get Monthly Outputs for a Histogram', async () => {
    const histogramByMonth: HistogramByMonth[] =
      await TimeseriesStatsDriver.getMonthlyOutputHistogram({
        sliceName: TEST_SLICE_NAME,
        outputs: TEST_OUPUTS_ALL,
      });
    expect(
      histogramByMonth.map((snapshot: HistogramByMonth) => ({
        ...snapshot,
        timestamp: new Date(0),
      })),
    ).toEqual([
      {
        timestamp: new Date(0),
        histogram: [
          {x: '0', y: 3},
          {x: '1', y: 2},
        ],
      },
    ]);
  });
  it('Should Get Node Overlap for a Venn Diagram', async () => {
    const vennByMonth: VennByMonth[] =
      await TimeseriesStatsDriver.getNodeOverlapVenn({
        sliceName: TEST_SLICE_NAME,
        nodeIds: TEST_NODES_VENN,
      });

    let modifiedActual: VennByMonth[] = vennByMonth.map<VennByMonth>(
      (snapshot: VennByMonth) => ({...snapshot, timestamp: new Date(0)}),
    );
    for (const monthSnapshot of modifiedActual) {
      for (let i = 0; i < monthSnapshot.venn.length; i++) {
        const nodeSnapshots: ChartBar[] = monthSnapshot.venn[i];
        monthSnapshot.venn[i] = nodeSnapshots.map<ChartBar>(
          (daySnapshot: ChartBar) => ({...daySnapshot, x: new Date(0)}),
        );
      }
    }

    expect(modifiedActual).toEqual<VennByMonth[]>([
      {
        timestamp: new Date(0),
        venn: [
          [
            {x: new Date(0), y: 1, y0: 0},
            {x: new Date(0), y: 1, y0: 0},
          ],
          [
            {x: new Date(0), y: 1, y0: 1},
            {x: new Date(0), y: 1, y0: 1},
          ],
          [
            {x: new Date(0), y: 1, y0: 2},
            {x: new Date(0), y: 1, y0: 2},
          ],
        ],
        outputs: [
          TEST_RATE_4.outputs,
          TEST_RATE_3.outputs,
          TEST_RATE_2.outputs,
          TEST_RATE_1.outputs,
        ],
      },
    ]);
  });
  it('Should Get Daily Outputs for a HeatMap', async () => {
    const heatMapByMonth: HeatMapByMonth[] =
      await TimeseriesStatsDriver.getDailyOutputHM({
        sliceName: TEST_SLICE_NAME,
        outputs: TEST_OUPUTS_ALL,
      });
    expect(
      heatMapByMonth.map<HeatMapByMonth>((heatMapSnapshot: HeatMapByMonth) => ({
        ...heatMapSnapshot,
        timestamp: new Date(0),
      })),
    ).toEqual<HeatMapByMonth[]>([
      {
        timestamp: new Date(0),
        heatMap: [
          {outputs: TEST_RATE_4.outputs},
          {outputs: TEST_RATE_3.outputs},
          {outputs: TEST_RATE_2.outputs},
          {outputs: TEST_RATE_1.outputs},
        ],
      },
    ]);
  });

  afterAll(async () => {
    await dbDriver.closeAll();

    if (fs.existsSync(mockTEST_DIRECTORY))
      fs.rmSync(mockTEST_DIRECTORY, {recursive: true});
  });
});

const initStore = (obj: Object) => {
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore(obj);

  return store;
};
