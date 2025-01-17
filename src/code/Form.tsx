import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Item, Setter, Setting } from './type';
import { Button } from './Button';

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

  const buttonState = useMemo(() => {
    for (let index = 0; index < list.length; index++) {
      const itm = list[index];
      if (itm.state === 'edit') {
        return 'edit';
      }
      if (itm.state === 'delete' && !itm.deletedTimestamp && !input.name) {
        return 'delete';
      }
    }

    return 'add';
  }, [input.name, list]);

  const add = useCallback(() => {
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

      setInput(defaultItem);
    }
  }, [input.name, setList, settings.sortOrder]);

  const edit = useCallback(() => {
    let resetInput = false;
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
    if (resetInput) {
      setInput(defaultItem);
    }
  }, [input, setList]);

  const del = useCallback(() => {
    setList((old) => {
      return old.map((itm) => {
        if (itm.state === 'delete' && !itm.deletedTimestamp) {
          itm.deletedTimestamp = Date.now();
        }
        return itm;
      });
    });
  }, [setList]);

  const onClick = useCallback(() => {
    switch (buttonState) {
      case 'edit': {
        edit();
        break;
      }
      case 'add': {
        add();
        break;
      }
    }
  }, [add, buttonState, edit]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      switch (buttonState) {
        case 'edit': {
          edit();
          break;
        }
        case 'add': {
          add();
          break;
        }
      }
    }
  }, [add, buttonState, edit]);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((old) => ({ ...old, name: e.target.value }));
  }, []);

  //  find item for editing
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
    <div className='flex flex-col justify-between gap-2 mb-4 mt-1'>
      <div className='w-full relative  '>
        <input
          onKeyDown={onKeyDown}
          onChange={onChange}
          className='w-full shadow-2xl rounded py-2 pl-2 pr-10 text-black min-h-9 md:min-h-7'
          type='text'
          value={input.name}
        />
        <Button
          type='button'
          className={classNames('text-black absolute z-10 right-0 pr-2 h-full w-10', {
          })}
          onClick={() => {
            setInput(defaultItem);
          }}
        >
          X
        </Button>
      </div>
      <Button
        onClick={onClick}
        onLongClick={del}
        className={classNames('border-2 border-white rounded-lg min-h-11 md:min-h-7 capitalize', {
          [settings.theme.form.show]: buttonState === 'add',
          [settings.theme.form.edit]: buttonState === 'edit',
          [settings.theme.form.delete]: buttonState === 'delete',
        })}
      >
        {buttonState}
      </Button>
    </div>
  );
}
