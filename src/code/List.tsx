import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import { Item, Setter } from './type';

type Props = {
  list: Item[];
  setList: Setter<Item[]>;
}

export function List({ list, setList }: Props) {
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
    <ul className='w-full flex flex-col gap-1 my-2'>
      {list.map((item) => {
        return (
          <li className='w-ful'>
            <span
              className={cn('w-full min-h-11  flex justify-between rounded', {
                'bg-green-500': item.state === 'show',
                'bg-pink-900': item.state === 'delete',
                'bg-blue-500': item.state === 'edit',
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
                className='w-full'
              >
                {item.name}
              </button>
              <span className='w-10 flex justify-center items-center'>
                {item.quantity}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
