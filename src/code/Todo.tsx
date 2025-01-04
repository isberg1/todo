import React from 'react';
import classNames from 'classnames';
import { usePersistState } from './usePersistState';
import { Item, Setting } from './type';
import { List } from './List';
import { Form } from './Form';
import { Settings } from './Settings';
import { Undo } from './Undo';

const defaultTheme: Setting['theme'] = {
  bg: 'bg-[#171d25]',
  textColor: 'text-[aliceblue]',
  form: {
    show: 'bg-green-700',
    edit: 'bg-blue-600',
    delete: 'bg-orange-500',
  },
  list: {
    show: 'bg-[#2b394a]',
    edit: 'bg-blue-500',
    delete: 'bg-pink-900',
    addQuantity: 'bg-blue-500',
    subQuantity: 'bg-pink-900',
  },
};

const defaultSetting: Setting = {
  sortOrder: 'newest',
  textSize: 'text-base',
  theme: defaultTheme,
};

export function Todo() {
  const [list, setList] = usePersistState<Item[]>([], 'itemList');
  const [settings, setSettings] = usePersistState<Setting>(defaultSetting, 'setting');

  return (
    <div className={classNames('flex flex-col justify-center items-center', {
      [settings.textSize]: true,
    })}
    >
      <div className='w-full sm:max-w-[60vw] p-4 '>
        <div className='w-full h-full flex justify-between '>
          <Undo
            setList={setList}
          />
          <Settings
            setList={setList}
            settings={settings}
            setSettings={setSettings}
          />
        </div>

        <Form
          list={list}
          setList={setList}
          settings={settings}
        />
        <List
          list={list}
          setList={setList}
          settings={settings}
        />
      </div>
    </div>
  );
}
