export interface IEvidence {
  id?: number;
  name?: string;
  fileContentType?: string;
  file?: any;
}

export const defaultValue: Readonly<IEvidence> = {};
