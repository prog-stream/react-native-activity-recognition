export type DetectedActivitiesCommon = "RUNNING" | "WALKING" | "UNKNOWN";

export type DetectedActivitiesAndroid =
  | ("IN_VEHICLE" | "ON_BICYCLE" | "ON_FOOT" | "STILL" | "TILTING")
  | DetectedActivitiesCommon;

export type DetectedActivitiesIos =
  | ("STATIONARY" | "AUTOMOTIVE" | "CYCLING")
  | DetectedActivitiesCommon;

export type AllActivities = DetectedActivitiesIos | DetectedActivitiesAndroid;

export type DetectedActivities = Record<AllActivities, number> & {
  sorted: { type: AllActivities; confidence: number }[];
};

export namespace ActivityRecognition {
  function subscribe(
    callback: (detectedActivities: DetectedActivities) => void
  ): () => void;
  function start(interval: number): void;
  function startMocked(interval: number, mockActivityType: AllActivities): void;
  function stop(): void;
  function stopMocked(): void;
}
export default ActivityRecognition;
