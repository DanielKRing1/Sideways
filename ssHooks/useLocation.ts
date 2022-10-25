export {};
// import {useEffect} from 'react';
// import * as TaskManager from 'expo-task-manager';
// import Location from 'expo-location';

// type LocationTaskArgs = {
//   data: {
//     locations?: Location.LocationGeocodedLocation[];
//   };
//   error: TaskManager.TaskManagerError | null;
// };

// export const useLocation = (
//   taskName: string,
//   onReceiveLocations: (locations: Location.LocationGeocodedLocation[]) => void,
// ) => {
//   // 0. Define new task
//   TaskManager.defineTask(
//     taskName,
//     async ({data: {locations}, error}: LocationTaskArgs) => {
//       // check `error.message` for more details.
//       if (error) return;

//       console.log('Received new locations', locations);

//       // 1. Shrink received locations array: Only the last 5 locations
//       locations = !locations ? [] : locations.slice(-5);
//       // 2. Call cb
//       onReceiveLocations(locations);

//       // 3. Reverse geocode last location
//       const geocodingOptions: Location.LocationGeocodingOptions = {
//         useGoogleMaps: false,
//       };
//       const geocodedAddress: Location.LocationGeocodedAddress[] =
//         await Location.reverseGeocodeAsync(
//           locations[locations.length - 1],
//           geocodingOptions,
//         );
//       // 4. Log location's name
//       console.log(geocodedAddress[0].name);
//     },
//   );

//   const [foregroundStatus, requestForegroundPermission] =
//     Location.useForegroundPermissions();
//   const [backgroundStatus, requestBackgroundPermission] =
//     Location.useBackgroundPermissions();

//   // Automatically execute this method upon using this hook
//   useEffect(() => {
//     const requestPermissions = async () => {
//       // 1. Request permissions
//       if (!!foregroundStatus && !foregroundStatus.granted)
//         await requestForegroundPermission();
//       if (!!backgroundStatus && !backgroundStatus.granted)
//         await requestBackgroundPermission();

//       // 2. Have permissions
//       if (
//         !!foregroundStatus &&
//         foregroundStatus.granted &&
//         !!backgroundStatus &&
//         backgroundStatus.granted
//       ) {
//         // 2.1. Unregister any previous task
//         await unregisterLocationListener();

//         // 2.2. Start new task
//         await Location.startLocationUpdatesAsync(taskName, {
//           accuracy: Location.Accuracy.Balanced,
//           timeInterval: 100,
//           distanceInterval: 1000 * 60 * 5,
//         });
//       }
//     };

//     requestPermissions();

//     return () => {
//       unregisterLocationListener();
//     };
//   }, [foregroundStatus, backgroundStatus]);

//   const unregisterLocationListener = async () => {
//     await Location.stopLocationUpdatesAsync(taskName);
//   };

//   return {
//     unregisterLocationListener,
//   };
// };
