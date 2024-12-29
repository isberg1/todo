import React, { useEffect, useRef, useState } from 'react';
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

  // set global styles from settings
  useEffect(() => {
    document.body.classList.add(setting.theme.textColor);
    document.body.classList.add(setting.theme.bg);
  }, [setting.theme.bg, setting.theme.textColor]);

  return (
    <>
      <button
        className={classNames('p-1  flex justify-center items-center', {
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
        className={classNames('max-w-[95vw] border-white rounded border-2 scroll-mt-4', {
          [setting.theme.bg]: true,
          [setting.theme.textColor]: true,
        })}
      >

        <div className='w-[85vw] md:w-[60vw] h-full p-1 flex flex-col justify-center items-center gap-1'>
          <div className='w-full flex justify-end sticky top-0 h-9'>
            <button
              className='right-0 mr-2 '
              onClick={() => {
                setShow(false);
                dialogEle.current?.close();
              }}
            >
              X
            </button>

          </div>
          <h1 className='-mt-1 underline'>Settings</h1>
          {textSizes.map((val) => (
            <button
              className='shadow px-2 min-h-11'
              onClick={() => setSetting((old) => ({ ...old, textSize: val }))}
            >{val}
            </button>
          ))}
        </div>

      </dialog>
    </>
  );
}
