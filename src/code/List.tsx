import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [start, setStart] = useState<Item | undefined>();
  const id = useRef<ReturnType<typeof setTimeout>>();

  const canEdit = useMemo(() => {
    const nrOfEditItems = list.reduce((prev, cur) => {
      if (cur.state === 'edit') {
        return prev + 1;
      }
      return prev;
    }, 0);

    return nrOfEditItems < 1;
  }, [list]);

  useEffect(() => {
    if (!start) return () => { };

    id.current = setTimeout(() => {
      setList((old) => {
        const tmp = [...old];
        const obj = tmp.find((v) => v.id === start?.id);
        if (!obj) return old;

        if (obj.state === 'show') {
          obj.state = (canEdit) ? 'edit' : 'delete';
        }

        return tmp;
      });
      id.current = undefined;
    }, 500);

    return () => clearTimeout(id.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start]);

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
                  setStart({ ...item });
                }
              }}
              onMouseDown={() => {
                setStart({ ...item });
              }}
              onTouchStart={() => {
                setStart({ ...item });
              }}
              onClick={() => {
                if (id.current) {
                  clearTimeout(id.current);
                } else {
                  return;
                }

                setList((old) => {
                  const tmp = [...old];
                  const obj = tmp.find((v) => v.id === item.id);
                  if (!obj) return old;

                  if (obj.state === 'show') {
                    obj.state = 'delete';
                  } else if (obj.state === 'delete') {
                    obj.state = 'show';
                  } else if (obj.state === 'edit') {
                    obj.state = 'show';
                  }
                  return tmp;
                });
                setStart(undefined);
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
