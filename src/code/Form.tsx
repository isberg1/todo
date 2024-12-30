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
  const [deleteActive, setDeleteActive] = useState(false);
  const canDelete = useRef(false);

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

  const onSubmit = useCallback((e: SyntheticEvent) => {
    e.preventDefault();
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
      case 'delete': {
        if (canDelete.current) {
          setList((old) => old.filter((item) => item.state !== 'delete'));
          canDelete.current = false;
        }
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
  }, [buttonState, input, setList]);

  const activateDel = useCallback(() => {
    if (buttonState === 'delete') {
      setDeleteActive(true);
    }
  }, [buttonState]);

  // set delete longClick flag
  useEffect(() => {
    if (!deleteActive) return () => { };

    const id = setTimeout(() => {
      canDelete.current = true;
    }, 1000);

    return () => { clearTimeout(id); };
  }, [deleteActive]);

  return (
    <form onSubmit={onSubmit}>
      <div className='flex flex-col justify-between gap-2 mb-4 mt-1'>
        <div className='w-full relative  '>
          <input
            className='w-full shadow-2xl rounded-sm p-2 text-black min-h-9 md:min-h-7'
            type='text'
            onChange={(e) => setInput((old) => ({ ...old, name: e.target.value }))}
            value={input.name}
          />
          <button
            type='button'
            className='text-black absolute z-10 right-0 pr-2 h-full w-10'
            onClick={(e) => {
              e.preventDefault();
              setInput(defaultItem);
            }}
          >
            X
          </button>
        </div>
        <button
          onMouseDown={() => { activateDel(); }}
          onTouchStart={() => { activateDel(); }}
          onMouseUp={() => { setDeleteActive(false); }}
          onTouchEnd={() => { setDeleteActive(false); }}
          onTouchCancel={() => { setDeleteActive(false); }}
          onMouseOut={() => { setDeleteActive(false); }}
          onBlur={() => { setDeleteActive(false); }}
          type='submit'
          className={classNames('border-2 border-white rounded-sm min-h-7 capitalize', {
            [setting.theme.form.show]: buttonState === 'add',
            [setting.theme.form.edit]: buttonState === 'edit',
            [setting.theme.form.delete]: buttonState === 'delete',
            'animate-[pulse_1s]  ease-[cubic-bezier(0.7, 0, 0.84, 0)]': deleteActive,
          })}
        >
          {buttonState}
        </button>
      </div>
    </form>
  );
}
