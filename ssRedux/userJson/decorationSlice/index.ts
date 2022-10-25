import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

import decorationDriver from 'ssDatabase/api/userJson/decoration';
import {getDecorationMapValue} from 'ssDatabase/hardware/realm/userJson/utils';

import {
  DecorationInfo,
  DecorationJson,
  DecorationJsonMap,
  DECORATION_ROW_KEY,
} from '../../../ssDatabase/api/types';
import {ThunkConfig} from '../../types';

// INITIAL STATE

export interface DecorationState {
  // DECORATIONS
  fullDecorationMap: DecorationJsonMap;

  // RERENDER
  decorationsSignature: {};
}

const initialState: DecorationState = {
  // DEACORATIONS
  fullDecorationMap: {
    [DECORATION_ROW_KEY.INPUT]: {},
    [DECORATION_ROW_KEY.OUTPUT]: {},
  },

  // RERENDER
  decorationsSignature: {},
};

// THUNKS

// SET ALL
type StartSetAllDecorationsArgs = undefined;
export const startSetAllDecorations = createAsyncThunk<
  boolean,
  StartSetAllDecorationsArgs,
  ThunkConfig
>(
  'decorationSlice/startSetAllDecorations',
  async (undefined: StartSetAllDecorationsArgs, thunkAPI) => {
    const fullDecorationMap: DecorationJsonMap =
      await decorationDriver.getAllDecorations();

    thunkAPI.dispatch(setDecorations(fullDecorationMap));
    thunkAPI.dispatch(forceSignatureRerender());

    return true;
  },
);

// UPDATE
type StartUpdateDecorationRow = {
  rowKey: DECORATION_ROW_KEY;
  newJson: DecorationJson;
};
export const startUpdateDecorationRow = createAsyncThunk<
  boolean,
  StartUpdateDecorationRow,
  ThunkConfig
>(
  'decorationSlice/startUpdateDecorationRow',
  async ({rowKey, newJson}: StartUpdateDecorationRow, thunkAPI) => {
    await decorationDriver.setDecorationRow(rowKey, newJson);

    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

/**
 * Updates Decoration.row.entityId
 * Creates new entityId if not exists
 */
type StartUpdateDecorationValue = {
  rowKey: DECORATION_ROW_KEY;
  entityId: string;
  newValue: string;
};
export const startUpdateDecorationText = createAsyncThunk<
  boolean,
  StartUpdateDecorationValue,
  ThunkConfig
>(
  'decorationSlice/startUpdateDecorationText',
  async (
    {rowKey, entityId: oldText, newValue: newText}: StartUpdateDecorationValue,
    thunkAPI,
  ) => {
    const {fullDecorationMap} =
      thunkAPI.getState().userJsonSlice.decorationSlice;

    // 1. Add new edited name
    const newJson: DecorationJson = {
      ...fullDecorationMap[rowKey],
      [newText]: getDecorationMapValue(rowKey, oldText, fullDecorationMap),
    };
    // 2. Remove old name
    delete fullDecorationMap[rowKey][oldText];

    // 3. Update db
    await decorationDriver.setDecorationRow(rowKey, newJson);

    // 4. Update Redux
    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

export const startUpdateDecorationColor = createAsyncThunk<
  boolean,
  StartUpdateDecorationValue,
  ThunkConfig
>(
  'decorationSlice/startUpdateDecorationColor',
  async (
    {rowKey, entityId, newValue: newColor}: StartUpdateDecorationValue,
    thunkAPI,
  ) => {
    const {fullDecorationMap} =
      thunkAPI.getState().userJsonSlice.decorationSlice;

    // 1. Add new color
    const newJson: DecorationJson = {
      ...fullDecorationMap[rowKey],
      [entityId]: {
        ...getDecorationMapValue(rowKey, entityId, fullDecorationMap),
        COLOR: newColor,
      },
    };

    // 2. Update db
    await decorationDriver.setDecorationRow(rowKey, newJson);

    // 3. Update Redux
    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

export const startUpdateDecorationIcon = createAsyncThunk<
  boolean,
  StartUpdateDecorationValue,
  ThunkConfig
>(
  'decorationSlice/startUpdateDecorationIcon',
  async (
    {rowKey, entityId, newValue: newIcon}: StartUpdateDecorationValue,
    thunkAPI,
  ) => {
    const {fullDecorationMap} =
      thunkAPI.getState().userJsonSlice.decorationSlice;

    // 1. Add new icon
    const newJson: DecorationJson = {
      ...fullDecorationMap[rowKey],
      [entityId]: {
        ...getDecorationMapValue(rowKey, entityId, fullDecorationMap),
        ICON: newIcon,
      },
    };

    // 3. Update db
    await decorationDriver.setDecorationRow(rowKey, newJson);

    // 4. Update Redux
    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

// ADD
type StartAddDecorationsArgs = DecorationInfo[];
export const startAddDecorations = createAsyncThunk<
  boolean,
  StartAddDecorationsArgs,
  ThunkConfig
>(
  'decorationSlice/startAddDecorations',
  async (newDecorations: StartAddDecorationsArgs, thunkAPI) => {
    await decorationDriver.saveDecorations(newDecorations);

    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

// RM
type StartRmDecorationsArgs = Omit<DecorationInfo, 'decoration'>[];
export const startRmDecorations = createAsyncThunk<
  boolean,
  StartRmDecorationsArgs,
  ThunkConfig
>(
  'decorationSlice/startRmDecorations',
  async (decorationsToRm: StartRmDecorationsArgs, thunkAPI) => {
    await decorationDriver.rmDecorations(decorationsToRm);

    thunkAPI.dispatch(startSetAllDecorations());

    return true;
  },
);

// ACTION TYPES

// Decoration
type SetDecorationsAction = PayloadAction<DecorationJsonMap>;
// Rerender
type ForceDecorationRerenderAction = PayloadAction<undefined>;

// SLICE

export const decorationSlice = createSlice({
  name: 'decorationSlice',
  initialState,
  reducers: {
    // COLORS
    setDecorations: (state: DecorationState, action: SetDecorationsAction) => {
      state.fullDecorationMap = action.payload;
    },

    // RERENDER
    forceSignatureRerender: (
      state: DecorationState,
      action: ForceDecorationRerenderAction,
    ) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes

      state.decorationsSignature = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {setDecorations, forceSignatureRerender} = decorationSlice.actions;

export default decorationSlice.reducer;
