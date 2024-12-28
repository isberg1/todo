import React, { } from 'react';
import { usePersistState } from './usePersistState';
import { Item } from './type';
import { List } from './Item';
import { Form } from './Form';

export function Todo() {
  const [list, setList] = usePersistState<Item[]>([], 'itemList');

  return (
    <div className=' flex flex-col justify-center items-center '>
      <div className='w-full sm:max-w-96 p-4 '>
        <Form
          list={list}
          setList={setList}
        />
        <List
          list={list}
          setList={setList}
        />
      </div>
    </div>
  );
}
