import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Item, Setter, Setting } from './type';
import { UndoIcon } from '../icons/UndoIcon';

type Props = {
  setList: Setter<Item[]>;
  settings: Setting;
}
export function Undo({
  setList,
  settings,
}: Props) {
  const [downActive, setDownActive] = useState(false);

  const onClick = useCallback(() => {
    setDownActive(false);
    let mostRecentIdx = -1;
    setList((old) => {
      old.forEach((v, i) => {
        if (v.state === 'delete' && v.deletedTimestamp) {
          const a = v.deletedTimestamp;
          const b = old[mostRecentIdx]?.deletedTimestamp || 0;
          if (a > b) {
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

  const onDown = useCallback(() => {
    setDownActive(true);
  }, []);

  return (
    <button
      onMouseDown={onDown}
      onTouchStart={onDown}
      className={classNames('flex justify-center items-center', {
        'scale-[99%]': downActive,
      })}
      onClick={onClick}
    >
      <UndoIcon settings={settings} />
    </button>
  );
}
