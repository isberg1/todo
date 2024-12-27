import React, { useState } from 'react';

export function Todo() {
  const [input, setInput] = useState('');
  return (
    <div className='flex flex-col justify-center items-center'>
      <h1>test</h1>
      <input
        type='text'
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
    </div>
  );
}
