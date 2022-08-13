import _getDistance from 'geolib/es/getDistance';

type Latitude = number | string;
type Longitude = number | string;
type Coordinate = {
    latitude: Latitude;
    longitude: Longitude;
};

export const getDistance = (a: Coordinate, b: Coordinate, accuracy: number = 1): number => {
    return _getDistance(a, b, accuracy);
};
