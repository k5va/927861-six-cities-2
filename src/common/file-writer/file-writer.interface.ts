export interface FileWriterInterface {
  readonly filename: string;
  write(line: string): Promise<void>;
}
