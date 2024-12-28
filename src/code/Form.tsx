import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Item, Setter } from './type';

const defaultItem: Item = {
  id: `${'-'}${0}`,
  name: '',
  quantity: 1,
  state: 'edit',
};

type Props = {
  list: Item[];
  setList: Setter<Item[]>;
}

export function Form({ list, setList }: Props) {
  const [input, setInput] = useState(defaultItem);

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
        setList((old) => old.filter((item) => item.state !== 'delete'));
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

  return (
    <form onSubmit={onSubmit}>
      <div className='flex flex-col justify-between gap-1'>
        <div className='w-full relative  '>
          <input
            className='w-full shadow-2xl rounded-sm p-2 text-black min-h-11'
            type='text'
            onChange={(e) => setInput((old) => ({ ...old, name: e.target.value }))}
            value={input.name}
          />
          <button
            type='button'
            className='text-black absolute z-10 right-0 h-full w-10  '
            onClick={(e) => {
              e.preventDefault();
              setInput(defaultItem);
            }}
          >
            X
          </button>
        </div>
        <button
          type='submit'
          className='border-2 border-blue-400 rounded-sm min-h-11 capitalize'
        >
          {buttonState}
        </button>
      </div>
    </form>
  );
}
