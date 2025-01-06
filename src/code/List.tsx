import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Item, Setter, Setting } from './type';
import { Quantity } from './Quantity';
import { debounce } from './utils';

type Props = {
  list: Item[];
  setList: Setter<Item[]>;
  settings: Setting;
}

export function List({
  list,
  setList,
  settings,
}: Props) {
  const [editObj, setEditObj] = useState<Item | undefined>();
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

  // longClick logic, do this via useEffect to handle both onMouseDown and onTouchStart being invoked for touch events
  useEffect(() => {
    if (!editObj) return () => { };

    id.current = setTimeout(() => {
      setList((old) => {
        const tmp = [...old];
        const obj = tmp.find((v) => v.id === editObj?.id);
        if (!obj) return old;

        if (obj.state === 'show') {
          obj.state = (canEdit) ? 'edit' : 'delete';
        }

        return tmp;
      });
      setEditObj(undefined);
    }, 500);

    return () => clearTimeout(id.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editObj]);

  const cancelClick = useCallback(() => {
    setEditObj(undefined);
  }, []);

  return (
    <ul className='w-full flex flex-col gap-2 my-2'>
      {list
        .filter((item) => !item.deletedTimestamp)
        .map((item) => {
          return (
            <li
              className={classNames('break-words w-full min-h-9 md:min-h-7 flex justify-between rounded-lg pl-1', {
                [settings.theme.list.show]: item.state === 'show',
                [settings.theme.list.delete]: item.state === 'delete',
                [settings.theme.list.edit]: item.state === 'edit',
                'outline outline-red-500': false,
              })}
            >
              <button
                // longClick
                onMouseDown={() => {
                  setEditObj({ ...item });
                }}
                // longClick
                onTouchStart={() => {
                  setEditObj({ ...item });
                }}
                onTouchMove={cancelClick}
                // normal Click
                onClick={() => {
                  if (!editObj) {
                    return;
                  }

                  setEditObj(undefined);
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
                }}
                className='w-full overflow-hidden my-1'
              >
                {item.name}
              </button>

              <Quantity
                item={item}
                setList={setList}
                settings={settings}
              />
            </li>
          );
        })}
    </ul>
  );
}
