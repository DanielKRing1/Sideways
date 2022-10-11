import RealmJsonManager, { RealmJson } from "@asianpersonn/realm-json";

import {
    DEFAULT_REALM_JSON_META_REALM_PATH,
    DEFAULT_REALM_JSON_LOADABLE_REALM_PATH,
    DEFAULT_REALM_JSON_ICON_KEY,
} from '../config';

import { Dict } from '../../../../../global';
import { IconDriver, IconInfo, StringMap } from "ssDatabase/api/types";

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
    if(!isLoaded) throw new Error('Must call "load()" before RealmJson (icons) can be used');
};

const saveIcons = (newIcons: IconInfo[]): void | never => {
    throwLoadError();

    const iconDict: Dict<string> = newIcons.reduce((acc: Dict<string>, cur: IconInfo) => {
        acc[cur.entityId] = cur.icon;

        return acc;
    }, {});
    
    const realmJson: RealmJson = RealmJsonManager.getCollection(DEFAULT_REALM_JSON_ICON_KEY);
    realmJson.addEntries(DEFAULT_REALM_JSON_ICON_KEY, iconDict);
};
const rmIcons = (iconsToRm: Omit<IconInfo, 'icon'>[]): void | never => {
    throwLoadError();

    const keysToRm: string[] = iconsToRm.map(({ entityId }: Omit<IconInfo, 'icon'>) => entityId);

    const realmJson: RealmJson = RealmJsonManager.getCollection(DEFAULT_REALM_JSON_ICON_KEY);
    realmJson.deleteEntries(DEFAULT_REALM_JSON_ICON_KEY, keysToRm);
};
const getAllIcons = (): StringMap | never => {
    throwLoadError();

    const realmJson: RealmJson = RealmJsonManager.getCollection(DEFAULT_REALM_JSON_ICON_KEY);
    return realmJson.getJson(DEFAULT_REALM_JSON_ICON_KEY);
};

const Driver: IconDriver = {
    isLoaded,
    load,
    closeAll,

    saveIcons,
    rmIcons,
    getAllIcons,
};

export default Driver;