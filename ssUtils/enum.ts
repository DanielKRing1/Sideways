import { Dict } from "../global";

export function iterateEnum(myEnum: Object, cb: (enumValue: any) => void): void {
    for (let value in myEnum) {
        if (isNaN(Number(value))) {
            cb(value)
        }
    }
};

export function getEnumValues(myEnum: Dict<any>): any[] {
    return Object.keys(myEnum).filter((key: string) => !isNaN(Number(myEnum[key])));
};
