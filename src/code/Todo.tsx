import React, { useState } from 'react';
import { usePersistState } from './usePersistState';

type Item = {
  name: string;
  quantaty: number;
}

export function Todo() {
  const [input, setInput] = useState('');
  const [list, setList] = usePersistState<Item[]>([], 'itemList');

  return (
    <div className=' flex flex-col justify-center items-center '>
      <div className='w-full sm:max-w-96 p-4 '>
        <div className='flex flex-col justify-between'>
          <input
            className='shadow-2xl rounded-sm p-2 text-black min-h-11'
            type='text'
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            onClick={() => {
              if (input) {
                setList((old) => [{ name: input, quantaty: 1 }, ...old]);
              }
            }}
            className='border-2 border-blue-400 rounded-sm min-h-11'
          >Add
          </button>
        </div>

        <ul className='w-full'>
          {list.map((val) => {
            return (
              <li className='w-full flex justify-between'>
                <span>
                  {val.name}
                </span>
                <span>{val.quantaty}

                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
