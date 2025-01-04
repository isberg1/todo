import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Item, Setter, Setting } from './type';

const defaultItem: Item = {
  id: `${'-'}${0}`,
  name: '',
  quantity: 1,
  state: 'edit',
  addTimestamp: Date.now(),
};

type Props = {
  list: Item[];
  setList: Setter<Item[]>;
  settings: Setting;
}

export function Form({
  list,
  setList,
  settings,
}: Props) {
  const [input, setInput] = useState(defaultItem);
  const id = useRef<ReturnType<typeof setTimeout>>();
  const [downActive, setDownActive] = useState(false);

  const buttonState = useMemo(() => {
    for (let index = 0; index < list.length; index++) {
      const itm = list[index];
      if (itm.state === 'edit') {
        return 'edit';
      }
      if (itm.state === 'delete' && !itm.deletedTimestamp) {
        return 'delete';
      }
    }

    return 'add';
  }, [list]);

  useEffect(() => {
    if (buttonState === 'edit') {
      const itm = list.find((item) => item.state === 'edit');
      if (itm) {
        setInput({ ...itm });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonState]);

  // longClick logic, do this via useEffect to handle both
  // onMouseDown and onTouchStart being invoked for touch events
  useEffect(() => {
    if (!downActive) return () => { };

    id.current = setTimeout(() => {
      setList((old) => {
        return old.map((itm) => {
          if (itm.state === 'delete') {
            itm.deletedTimestamp = Date.now();
          }
          return itm;
        });
      });
      setDownActive(false);
    }, 500);

    return () => clearTimeout(id.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downActive]);

  return (
    <div className='flex flex-col justify-between gap-2 mb-4 mt-1'>
      <div className='w-full relative  '>
        <input
          className='w-full shadow-2xl rounded p-2 text-black min-h-9 md:min-h-7 break-all'
          type='text'
          onChange={(e) => setInput((old) => ({ ...old, name: e.target.value }))}
          value={input.name}
        />
        <button
          type='button'
          className='text-black absolute z-10 right-0 pr-2 h-full w-10'
          onClick={() => {
            setInput(defaultItem);
          }}
        >
          X
        </button>
      </div>
      <button
        // longClick
        onMouseDown={() => {
          setDownActive(true);
        }}
        // longClick
        onTouchStart={() => {
          setDownActive(true);
        }}
        // normal Click
        onClick={() => {
          if (!downActive) { // longClick has handled click
            return;
          }
          setDownActive(false);
          let resetInput = false;

          switch (buttonState) {
            case 'edit': {
              setList((old) => {
                const idx = old.findIndex((item) => item.id === input.id);
                if (idx !== -1) {
                  resetInput = true;
                  const tmp = [...old];
                  tmp[idx] = input;
                  tmp[idx].state = 'show';

                  return tmp;
                }
                return old;
              });
              break;
            }
            case 'add': {
              if (input.name) {
                setList((old) => {
                  const newObj = {
                    name: input.name,
                    quantity: 1,
                    state: 'show',
                    id: `${input.name}${Date.now()}`,
                    addTimestamp: Date.now(),
                  } as const;

                  if (settings.sortOrder === 'newest') {
                    return [newObj, ...old];
                  }
                  if (settings.sortOrder === 'oldest') {
                    return [...old, newObj];
                  }
                  return old;
                });

                resetInput = true;
              }
              break;
            }
          }

          if (resetInput) {
            setInput(defaultItem);
          }
        }}
        className={classNames('border-2 border-white rounded-lg min-h-10 md:min-h-7 capitalize', {
          [settings.theme.form.show]: buttonState === 'add',
          [settings.theme.form.edit]: buttonState === 'edit',
          [settings.theme.form.delete]: buttonState === 'delete',
          'animate-[pulse_1s]  ease-[cubic-bezier(0.7, 0, 0.84, 0)]': downActive,
        })}
      >
        {buttonState}
      </button>
    </div>
  );
}
