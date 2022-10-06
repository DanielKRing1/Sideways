import Realm from 'realm';
import { DEFAULT_REALM_GRAPH_META_REALM_PATH, DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH, DEFAULT_REALM_STACK_META_REALM_PATH, DEFAULT_REALM_STACK_LOADABLE_REALM_PATH } from "../ssDatabase/hardware/realm/config";

export const resetRealm = () => {
    console.log('About to delete all realm files');
    
    Realm.deleteFile({ path: DEFAULT_REALM_GRAPH_META_REALM_PATH });
    Realm.deleteFile({ path: DEFAULT_REALM_GRAPH_LOADABLE_REALM_PATH });
    Realm.deleteFile({ path: DEFAULT_REALM_STACK_META_REALM_PATH });
    Realm.deleteFile({ path: DEFAULT_REALM_STACK_LOADABLE_REALM_PATH });
    console.log('Deleted all realm files');
}