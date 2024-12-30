import React from 'react';
import classNames from 'classnames';
import { usePersistState } from './usePersistState';
import { Item, Setting } from './type';
import { List } from './List';
import { Form } from './Form';
import { Settings } from './Settings';

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
  },
};

const defaultSetting: Setting = {
  textSize: 'text-base',
  theme: defaultTheme,
};

export function Todo() {
  const [list, setList] = usePersistState<Item[]>([], 'itemList');
  const [setting, setSetting] = usePersistState<Setting>(defaultSetting, 'setting');

  return (
    <div className={classNames('flex flex-col justify-center items-center', {
      [setting.textSize]: true,
    })}
    >
      <div className='w-full sm:max-w-[60vw] p-4 '>
        <div className='w-full h-full flex justify-end '>
          <Settings
            setting={setting}
            setSetting={setSetting}
          />
        </div>

        <Form
          list={list}
          setList={setList}
          setting={setting}
        />
        <List
          list={list}
          setList={setList}
          setting={setting}
        />
      </div>
    </div>
  );
}
