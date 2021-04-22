# @progstream/react-native-activity-recognition

## Motivation

This is a fork of [react-native-activity-recognition](https://github.com/Aminoid/react-native-activity-recognition) which is unmaintained now. We have updated it to support react-native@0.60+ and fixed some old dependencies.

[![npm version][npm shield]][npm url]

React Native wrapper for the [Android Activity Recognition API][1] and [CMMotionActivity][3]. It attempts to determine the user activity such as
driving, walking, running and cycling. Possible detected activities for android are [listed here][2] and for iOS are [listed here][3].<br/>
Updated January 7th and tested with react-native v0.57.5

[1]: https://developers.google.com/android/reference/com/google/android/gms/location/ActivityRecognition
[2]: https://developers.google.com/android/reference/com/google/android/gms/location/DetectedActivity
[3]: https://developer.apple.com/reference/coremotion/cmmotionactivity
[4]: https://facebook.github.io/react-native/docs/linking-libraries-ios.html#manual-linking
[npm shield]: https://img.shields.io/npm/v/@progstream/react-native-activity-recognition
[npm url]: https://www.npmjs.com/package/@progstream/react-native-activity-recognition

## Installation

```bash
npm i -S @progstream/react-native-activity-recognition
```

or with Yarn:

```bash
yarn add @progstream/react-native-activity-recognition
```

## Linking

Make alterations to the following files in your project:

#### Android

1. Add following lines to `android/settings.gradle`

```gradle
...
include ':react-native-activity-recognition'
project(':react-native-activity-recognition').projectDir = new File(rootProject.projectDir, '../node_modules/@progstream/react-native-activity-recognition/android')
...
```

2. Add these lines to dependencies in `android/app/build.gradle`

```gradle
...
dependencies {
    ...
    implementation 'androidx.localbroadcastmanager:localbroadcastmanager:1.0.0'
    implementation project(':react-native-activity-recognition')
    ...
}
```

3. Add activityrecognition service in `android/app/src/main/AndroidManifest.xml`

```xml
...
<application ...>
    ...
    <service android:name="com.xebia.activityrecognition.DetectionService"/>
    ...
</application>
...
```

4. Add ACTIVITY_RECOGNITION permission in `android/app/src/main/AndroidManifest.xml`

```xml
...
<manifest ...>
    ...
    <uses-permission android:name="com.google.android.gms.permission.ACTIVITY_RECOGNITION"/>
    ...
</manifest>
...
```

#### iOS

1. In the XCode's "Project navigator", right click on your project's Libraries folder ➜ `Add Files to <...>`
2. Go to `node_modules` ➜ `react-native-activity-recognition` ➜ `ios` ➜ select `RNActivityRecognition.xcodeproj`
3. Add `RNActivityRecognition.a` to `Build Phases -> Link Binary With Libraries`
4. Add `NSMotionUsageDescription` key to your `Info.plist` with strings describing why your app needs this permission

## Usage

### Class based implementation

```js
import ActivityRecognition from '@progstream/react-native-activity-recognition'

...

// Subscribe to updates
this.unsubscribe = ActivityRecognition.subscribe(detectedActivities => {
  const mostProbableActivity = detectedActivities.sorted[0]
})

...

// Start activity detection
const detectionIntervalMillis = 1000
ActivityRecognition.start(detectionIntervalMillis)

...

// Stop activity detection and remove the listener
ActivityRecognition.stop()
this.unsubscribe()
```

### Hooks based implementation

```js
import ActivityRecognition from '@progstream/react-native-activity-recognition'

...

  useEffect(() => {
    // Subscribe to updates on mount
    const unsubscribe = ActivityRecognition.subscribe(detectedActivities => {
      const mostProbableActivity = detectedActivities.sorted[0];
      console.log(mostProbableActivity);
    });
    const interval = 1000;
    // Start activity detection
    ActivityRecognition.start(interval);
    return () => {
      // Stop activity detection and remove the listener on unmount
      ActivityRecognition.stop();
      unsubscribe();
    };
  }, []);
```

### Android

`detectedActivities` is an object with keys for each detected activity, each of which have an integer percentage (0-100) indicating the likelihood that the user is performing this activity. For example:

```js
{
  ON_FOOT: 8,
  IN_VEHICLE: 15,
  WALKING: 8,
  STILL: 77
}
```

Additionally, the `detectedActivities.sorted` getter is provided which returns an array of activities, ordered by their
confidence value:

```js
[
  { type: "STILL", confidence: 77 },
  { type: "IN_VEHICLE", confidence: 15 },
  { type: "ON_FOOT", confidence: 8 },
  { type: "WALKING", confidence: 8 },
];
```

Because the activities are sorted by confidence level, the first value will be the one with the highest probability
Note that ON_FOOT and WALKING are related but won't always have the same value. I have never seen WALKING with a higher
confidence than ON_FOOT, but it may happen that WALKING comes before ON_FOOT in the array if they have the same value.

The following activity types are supported:

- IN_VEHICLE
- ON_BICYCLE
- ON_FOOT
- RUNNING
- WALKING
- STILL
- TILTING
- UNKNOWN

### iOS

`detectedActivities` is an object with key to the detected activity with a confidence value for that activity given by CMMotionActivityManager. For example:

```js
{
  WALKING: 2;
}
```

`detectedActivities.sorted` getter will return it in the form of an array.

```js
[{ type: "WALKING", confidence: 2 }];
```

The following activity types are supported:

- RUNNING
- WALKING
- STATIONARY
- AUTOMOTIVE
- CYCLING
- UNKNOWN

## Credits / prior art

The following projects were very helpful in developing this library:

- https://github.com/googlesamples/android-play-location
- https://bitbucket.org/timhagn/react-native-google-locations
- https://github.com/facebook/react-native/blob/master/Libraries/Geolocation
