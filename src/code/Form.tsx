import React, { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Item, Setter, Setting } from './type';

const defaultItem: Item = {
  id: `${'-'}${0}`,
  name: '',
  quantity: 1,
  state: 'edit',
};

type Props = {
  list: Item[];
  setList: Setter<Item[]>;
  setting: Setting;
}

export function Form({
  list, setList, setting,
}: Props) {
  const [input, setInput] = useState(defaultItem);
  const [downActive, setDownActive] = useState(false);
  const id = useRef<ReturnType<typeof setTimeout>>();

  const [deleteObj, setDeleteObj] = useState<Item[]>();

  const buttonState = useMemo(() => {
    if (list.some((item) => item.state === 'edit')) {
      return 'edit';
    }

    if (list.some((item) => item.state === 'delete')) {
      return 'delete';
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

  // longClick logic, do this via useEffect to handle both onMouseDown and onTouchStart being invoked for touch events
  useEffect(() => {
    if (!deleteObj) return () => { };

    id.current = setTimeout(() => {
      setList((old) => old.filter((itm) => itm.state !== 'delete'));
      setDeleteObj(undefined);
    }, 500);

    return () => clearTimeout(id.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteObj]);

  return (
    <div className='flex flex-col justify-between gap-2 mb-4 mt-1'>
      <div className='w-full relative  '>
        <input
          className='w-full shadow-2xl rounded p-2 text-black min-h-9 md:min-h-7 break-all
          '
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
        onMouseUp={() => {
          setDownActive(false);
        }}
        onTouchEnd={() => {
          setDownActive(false);
        }}
        // longClick
        onMouseDown={() => {
          setDeleteObj(list.filter((v) => v.state === 'delete'));
          setDownActive(true);
        }}
        // longClick
        onTouchStart={() => {
          setDeleteObj(list.filter((v) => v.state === 'delete'));
          setDownActive(true);
        }}
        // normal Click
        onClick={() => {
          if (!deleteObj) {
            return;
          }

          setDeleteObj(undefined);

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
              if (input) {
                setList((old) => [{
                  name: input.name, quantity: 1, state: 'show', id: `${input}${Date.now()}`,
                }, ...old]);

                resetInput = true;
              }
              break;
            }
          }

          if (resetInput) {
            setInput(defaultItem);
          }
        }}
        className={classNames('border-2 border-white rounded-lg min-h-7 capitalize', {
          [setting.theme.form.show]: buttonState === 'add',
          [setting.theme.form.edit]: buttonState === 'edit',
          [setting.theme.form.delete]: buttonState === 'delete',
          'animate-[pulse_1s]  ease-[cubic-bezier(0.7, 0, 0.84, 0)]': downActive,
        })}
      >
        {buttonState}
      </button>
    </div>
  );
}
