export interface ResourceMetadata {
  path: string;
  type: string;
  originalName: string;
  description?: string;
  createdAt: string;
}

export interface ResourceMap {
  [uuid: string]: ResourceMetadata;
}
