export type Item = {
  name: string;
  quantity: number;
  state: 'show' | 'delete' | 'edit';
  id: `${string}${number}`;
  addTimestamp?: number;
  deletedTimestamp?: number;
}

export type Setter<T> = (settter: T | ((oldV: T) => T)) => void

export type Setting = {
  sortOrder: 'newest' | 'oldest';
  theme: {
    bg: string;
    textColor: string;
    form: {
      show: string;
      edit: string;
      delete: string;
    };
    list: {
      show: string;
      edit: string;
      delete: string;
      addQuantity: string;
      subQuantity: string;
    };
  };
  textSize: string;
}
