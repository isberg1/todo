import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Item, Setter, Setting } from './type';
import { UndoIcon } from '../icons/UndoIcon';
import { Button } from './Button';

type Props = {
  setList: Setter<Item[]>;
  settings: Setting;
}
export function Undo({
  setList,
  settings,
}: Props) {
  const onClick = useCallback(() => {
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

  return (
    <Button
      onClickAnimation='scale-[95%]'
      className={classNames('flex justify-center items-center', {
      })}
      onClick={onClick}
    >
      <UndoIcon settings={settings} />
    </Button>
  );
}
