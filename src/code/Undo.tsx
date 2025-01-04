import React, { useCallback } from 'react';
import { Item, Setter } from './type';

type Props = {
  setList: Setter<Item[]>;
}
export function Undo({ setList }: Props) {
  const onClick = useCallback(() => {
    try {
      // TODO
    } catch (_) { }
  }, []);

  return (
    <div>
      <button
        onClick={onClick}
      >undo
      </button>
    </div>
  );
}
