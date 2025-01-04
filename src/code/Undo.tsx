import React, { useCallback } from 'react';
import { Item, Setter } from './type';

type Props = {
  setList: Setter<Item[]>;
}
export function Undo({
  setList,
}: Props) {
  const onClick = useCallback(() => {
    let mostRecentIdx = -1;
    setList((old) => {
      old.forEach((v, i) => {
        if (v.state === 'delete' && v.deletedTimestamp) {
          if (v.deletedTimestamp > (old[mostRecentIdx]?.deletedTimestamp || 0)) {
            mostRecentIdx = i;
          }
        }
      });
      if (mostRecentIdx === -1) return old;

      const tmp = [...old];
      tmp[mostRecentIdx].state = 'show';
      delete tmp[mostRecentIdx].deletedTimestamp;
      return tmp;
    });
  }, [setList]);

  return (
    <div>
      <button
        onClick={onClick}
      >
        undo
      </button>
    </div>
  );
}