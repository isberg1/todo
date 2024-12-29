import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { Item, Setter, Setting } from './type';

type Props = {
  list: Item[];
  setList: Setter<Item[]>;
  setting: Setting;
}

export function List({
  list, setList, setting,
}: Props) {
  const [start, setStart] = useState<number>(0);

  const canEdit = useMemo(() => {
    const nrOfEditItems = list.reduce((prev, cur) => {
      if (cur.state === 'edit') {
        return prev + 1;
      }
      return prev;
    }, 0);

    return nrOfEditItems < 1;
  }, [list]);

  return (
    <ul className='w-full flex flex-col gap-2 my-2'>
      {list.map((item) => {
        return (
          <li
            className={cn('w-full min-h-7 flex justify-between rounded', {
              [setting.theme.list.show]: item.state === 'show',
              [setting.theme.list.delete]: item.state === 'delete',
              [setting.theme.list.edit]: item.state === 'edit',
              'outline outline-red-500': false,
            })}
          >
            <button
              onKeyDown={(e) => {
                if (e.code === 'Enter' || e.code === 'Space') {
                  setStart(Date.now());
                }
              }}
              onMouseDown={() => setStart(Date.now())}
              onTouchStart={() => setStart(Date.now())}
              onClick={() => {
                setList((old) => {
                  const tmp = [...old];
                  const obj = tmp.find((v) => v.id === item.id);
                  if (!obj) return old;

                  if (obj.state === 'show') {
                    const isLongClick = (Date.now() - start) > 500;
                    obj.state = (isLongClick && canEdit) ? 'edit' : 'delete';
                  } else if (obj.state === 'delete') {
                    obj.state = 'show';
                  } else if (obj.state === 'edit') {
                    obj.state = 'show';
                  }
                  return tmp;
                });
                setStart(0);
              }}
              className='w-full my-1'
            >
              {item.name}
            </button>
            <span className='w-10 flex justify-center items-center'>
              {item.quantity}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
