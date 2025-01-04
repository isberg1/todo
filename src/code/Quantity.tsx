/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import React, { useRef, useState, useCallback } from 'react';
import { Item, Setter, Setting } from './type';
import { debounce } from './utils';

const minHorizontalMove = 1; // Minimum horizontal movement to trigger swipe
const withinMs = 100000; // Maximum time duration for swipe

type StartSwipe = {
  startX: number;
  startTime: number;
}

type Props = {
  item: Item;
  setList: Setter<Item[]>;
  settings: Setting;
}

export function Quantity({
  item,
  setList,
  settings,
}: Props) {
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
