import RealmJsonManager, { RealmJson } from "@asianpersonn/realm-json";

import {
    DEFAULT_REALM_JSON_META_REALM_PATH,
    DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
    DEFAULT_REALM_JSON_COLOR_KEY,
} from '../config';

import { Dict } from '../../../../../global';
import { ColorDriver, ColorInfo, StringMap } from "ssDatabase/api/types";

// VARIABLES
let isLoaded: boolean = false;

// LOAD/CLOSE ----

const load = async (): Promise<void> => {
    if(isLoaded) return;

    const jsonPromise = RealmJsonManager.loadCollections(DEFAULT_REALM_JSON_META_REALM_PATH, DEFAULT_REALM_JSON_LOADABLE_REALM_PATH);

    await Promise.all([jsonPromise]);

    isLoaded = true;
};

const closeAll = async (): Promise<void> => {
    await RealmJsonManager.closeAllCollections();

    isLoaded = false;
};

const throwLoadError = (): void | never => {
    if(!isLoaded) throw new Error('Must call "load()" before RealmJson (colors) can be used');
};

const saveColors = (newColors: ColorInfo[]): void | never => {
    throwLoadError();

    const colorDict: Dict<string> = newColors.reduce((acc: Dict<string>, cur: ColorInfo) => {
        acc[cur.entityId] = cur.color;

        return acc;
    }, {});
    
    const realmJson: RealmJson = RealmJsonManager.getCollection(DEFAULT_REALM_JSON_COLOR_KEY);
    realmJson.addEntries(DEFAULT_REALM_JSON_COLOR_KEY, colorDict);
};
const rmColors = (colorsToRm: Omit<ColorInfo, 'color'>[]): void | never => {
    throwLoadError();

    const keysToRm: string[] = colorsToRm.map(({ entityId }: Omit<ColorInfo, 'color'>) => entityId);

    const realmJson: RealmJson = RealmJsonManager.getCollection(DEFAULT_REALM_JSON_COLOR_KEY);
    realmJson.deleteEntries(DEFAULT_REALM_JSON_COLOR_KEY, keysToRm);
};
const getAllColors = (): StringMap | never => {
    throwLoadError();

    const realmJson: RealmJson = RealmJsonManager.getCollection(DEFAULT_REALM_JSON_COLOR_KEY);
    return realmJson.getJson(DEFAULT_REALM_JSON_COLOR_KEY);
};

const Driver: ColorDriver = {
    isLoaded,
    load,
    closeAll,

    saveColors,
    rmColors,
    getAllColors,
};

export default Driver;