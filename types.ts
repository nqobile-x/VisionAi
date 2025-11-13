
export interface DetailedDescription {
  setting: string;
  people: string;
  objects: string;
  text_visible: string;
  hazards: string;
  navigation: string;
}

export interface SceneDescriptionResponse {
  mode: 'scene_description';
  priority: 'SAFE' | 'CAUTION' | 'INFO' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  immediate_alert: string;
  quick_summary: string;
  detailed_description: DetailedDescription;
  spatial_layout: string;
  actionable_guidance: string;
  speech_output: string;
}
