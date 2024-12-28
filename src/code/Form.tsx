import React, { useEffect, useMemo, useState } from 'react';
import { Item, Setter } from './type';

const noOp = () => { };

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

  return (
    <form onSubmit={noOp}>
      <div className='flex flex-col justify-between gap-1'>
        <input
          className='shadow-2xl rounded-sm p-2 text-black min-h-11'
          type='text'
          onChange={(e) => setInput((old) => ({ ...old, name: e.target.value }))}
          value={input.name}
        />
        <button
          className='border-2 border-blue-400 rounded-sm min-h-11 capitalize'
          onClick={(e) => {
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
          }}
        >
          {buttonState}
        </button>
      </div>
    </form>
  );
}
