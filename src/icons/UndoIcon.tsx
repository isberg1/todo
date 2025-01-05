import React from 'react';
import classNames from 'classnames';
import { Setting } from '../code/type';

type Props = {
  settings: Setting;
}

export function UndoIcon({ settings }: Props) {
  return (
    <svg
      className={classNames('min-h-6 min-w-6', {
        [settings.theme.textColor]: true,
        [settings.textSize]: true,
      })}
      xmlns='http://www.w3.org/2000/svg'
      height='1em'
      width='1em'
      viewBox='0 -960 960 960'
      fill='undefined'
    >
      <path
        fill='currentColor'
        d='M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z'
      />
    </svg>
  );
}
