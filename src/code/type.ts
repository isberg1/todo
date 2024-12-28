export type Item = {
  name: string;
  quantity: number;
  state: 'show' | 'delete' | 'edit';
  id: `${string}${number}`;
}

export type Setter<T> = (settter: T | ((oldV: T) => T)) => void
