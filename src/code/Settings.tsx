import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Setter, Setting } from './type';
import { IconSettings } from '../icons/setting-5-svgrepo-com';

type Props = {
  setting: Setting;
  setSetting: Setter<Setting>;

}

const textSizes = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
  'text-5xl',
];

export function Settings({ setting, setSetting }: Props) {
  const [show, setShow] = useState(false);
  const dialogEle = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        className={classNames('p-1  flex justify-center items-center', {
          [setting.textSize]: true,
          [setting.theme.textColor]: true,
        })}
        onClick={() => {
          setShow(true);
          dialogEle.current?.showModal();
        }}
      >
        <IconSettings setting={setting} />
      </button>

      <dialog
        ref={dialogEle}
        open={show}
        className='max-w-[95vw]'
      >

        <div className='w-[90vw] h-full p-1 flex flex-col justify-center items-center'>
          <div className='w-full flex justify-end'>
            <button
              onClick={() => {
                setShow(false);
                dialogEle.current?.close();
              }}
            >
              X
            </button>

          </div>
          <h1>Settings</h1>
          {textSizes.map((val) => (
            <button
              onClick={() => setSetting((old) => ({ ...old, textSize: val }))}
            >{val}
            </button>
          ))}
        </div>

      </dialog>
    </>
  );
}
