export type IO = {
  input: () => Promise<string | undefined>;
  output: (text: string) => void;
};
