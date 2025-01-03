/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Item, Setter, Setting } from './type';

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

  return (
    <ul className='w-full flex flex-col gap-2 my-2'>
      {list.map((item) => {
        return (
          <li
            className={classNames('break-all w-full min-h-9 md:min-h-7 flex justify-between rounded-lg pl-1', {
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
              className='w-full my-1'
            >
              {item.name}
            </button>
            <Quantity item={item} setList={setList} settings={settings} />
          </li>
        );
      })}
    </ul>
  );
}

function debounce(func: (...a: any[]) => any, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const minHorizontalMove = 1; // Minimum horizontal movement to trigger swipe
const withinMs = 100000; // Maximum time duration for swipe

type StartSwipe = {
  startX: number;
  startTime: number;
}

type QaProps = {
  item: Item;
  setList: Setter<Item[]>;
  settings: Setting;
}
function Quantity({
  item, setList, settings,
}: QaProps) {
  const startSwipe = useRef<StartSwipe | undefined>();
  const [posSwipe, setPosSwipe] = useState(0);

  const resetSwipe = useCallback(() => {
    setPosSwipe(0);
    startSwipe.current = undefined;
  }, []);

  const onSwipeStart = useCallback(debounce((startX: number) => {
    startSwipe.current = {
      startTime: Date.now(),
      startX,
    };
  }, 10), []);

  const onSwipeMove = useCallback((endXPos: number) => {
    if (!startSwipe.current) return;

    const endTime = Date.now();
    const moveX = endXPos - startSwipe.current.startX;
    const elapsedTime = endTime - startSwipe.current.startTime;

    switch (true) {
      case elapsedTime > withinMs: {
        resetSwipe();
        return;
      }
      case Math.abs(moveX) < minHorizontalMove: {
        return;
      }
      case moveX < -30: {
        resetSwipe();
        setList((old) => {
          if (item.quantity === 1) return old;

          const tmp = [...old];
          const idx = tmp.findIndex((ele) => ele.id === item.id);
          tmp[idx].quantity -= 1;

          return tmp;
        });
        return;
      }
      case moveX > 30: {
        resetSwipe();
        setList((old) => {
          const tmp = [...old];
          const idx = tmp.findIndex((ele) => ele.id === item.id);
          tmp[idx].quantity += 1;

          return tmp;
        });
        return;
      }
      default: {
        setPosSwipe(moveX);
      }
    }
  }, [item.id, item.quantity, resetSwipe, setList]);

  return (
    <span
      onTouchEnd={() => {
        resetSwipe();
      }}
      onTouchStart={(e) => {
        if (e.touches?.[0] === undefined) return;

        onSwipeStart(e.touches[0].pageX);
      }}
      onTouchMove={(e) => {
        if (!startSwipe.current) return;

        onSwipeMove(e.changedTouches[0].pageX);
      }}
      onMouseDown={(e) => {
        onSwipeStart(e.pageX);
        const onMouseMove = (x: MouseEvent) => {
          if (!startSwipe.current) return;

          onSwipeMove(x.pageX);
        };
        document.addEventListener('mousemove', onMouseMove);

        document.addEventListener('mouseup', () => {
          if (!startSwipe.current) return;

          document.removeEventListener('mousemove', onMouseMove);
          resetSwipe();
        }, { once: true }
        );
      }}
      className={classNames('w-fit min-w-16 md:min-w-7 px-2  flex justify-end items-center select-none break-normal rounded-e-md', {
        [settings.theme.list.addQuantity]: posSwipe > 0,
        [settings.theme.list.subQuantity]: posSwipe < 0,

      })}
    >
      <span className={classNames('', {
        'opacity-0': !(posSwipe > 0),
        hidden: (posSwipe < 0),
      })}
      >+1
      </span>
      <span className={classNames('', {
        hidden: !(posSwipe < 0),
      })}
      >-1
      </span>
      {!posSwipe && item.quantity}
    </span>
  );
}
