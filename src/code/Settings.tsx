/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Item, Setter, Setting } from './type';
import { IconSettings } from '../icons/setting-5-svgrepo-com';

type Props = {
  settings: Setting;
  setSettings: Setter<Setting>;
  setList: Setter<Item[]>;
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
];

const SortOptions = ['newest', 'oldest'] as const;

export function Settings({
  settings,
  setSettings,
  setList,
}: Props) {
  const [show, setShow] = useState(false);
  const [sliderValue, setSetSliderValue] = useState(() => textSizes.findIndex((ele, idx) => {
    if (ele === settings.textSize) {
      return true;
    }
    return false;
  }));
  const dialogEle = useRef<HTMLDialogElement>(null);

  // update textSize slider when settings changes
  useEffect(() => {
    const idx = textSizes.findIndex((ele) => {
      if (ele === settings.textSize) {
        return true;
      }
      return false;
    });
    setSetSliderValue(idx);
  }, [settings.textSize]);

  // set global styles from settings
  useEffect(() => {
    document.body.classList.add(settings.theme.textColor);
    document.body.classList.add(settings.theme.bg);
  }, [settings.theme.bg, settings.theme.textColor]);

  const updateSortOrder = useCallback((newVal: typeof SortOptions[number]) => {
    setSettings((old) => ({ ...old, sortOrder: newVal }));

    setList((old) => {
      if (newVal === 'oldest') {
        return [...old].sort((a, b) => ((a.timeStamp || 0) < (b.timeStamp || 0) ? -1 : 1));
      }
      if (newVal === 'newest') {
        return [...old].sort((a, b) => ((a.timeStamp || 0) > (b.timeStamp || 0) ? -1 : 1));
      }

      return old;
    });
  }, [setList, setSettings]);

  return (
    <>
      <button
        className={classNames('p-1 flex justify-center items-center', {
          [settings.theme.textColor]: true,
        })}
        onClick={() => {
          setShow(true);
          dialogEle.current?.showModal();
        }}
      >
        <IconSettings settings={settings} />
      </button>

      <dialog
        onClick={(event) => {
          const rect = dialogEle.current?.getBoundingClientRect();
          if (!rect) return;

          const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX && event.clientX <= rect.left + rect.width);

          if (!isInDialog) {
            setShow(false);
            dialogEle.current?.close();
          }
        }}
        ref={dialogEle}
        open={show}
        className={classNames('max-w-[95vw] border-white rounded-lg border-2 scroll-mt-4 backdrop:bg-black/50 backdrop:backdrop-blur-[1px]', {
          [settings.theme.bg]: true,
          [settings.theme.textColor]: true,
        })}
      >

        <div className='w-[85vw] md:w-[60vw] h-full p-1 flex flex-col justify-center items-center gap-1'>
          <div className='w-full flex justify-end sticky top-0'>
            <button
              className='right-0 mr-2 rounded-full px-2'
              onClick={() => {
                setShow(false);
                dialogEle.current?.close();
              }}
            >
              X
            </button>

          </div>
          <h1 className='-mt-1 underline'>Settings</h1>

          <div className=' min-h-9 w-full flex flex-col justify-center items-center gap-3 mb-3'>
            <div className='w-full flex flex-col justify-center items-center'>
              <span>Text Size: {sliderValue}</span>
              <input
                className='w-[90%]  md:w-9/12'
                type='range'
                min='0'
                max={textSizes.length - 1}
                value={sliderValue}
                onChange={(e) => {
                  setSetSliderValue(Number(e.target.value));
                  setSettings((old) => ({ ...old, textSize: textSizes[Number(e.target.value)] }));
                }}
              />
            </div>

            <fieldset className='flex flex-col justify-center items-center gap-1 min-h-10 md:min-h-7'>
              <legend>Sort Order:</legend>
              <div className='flex justify-center items-center gap-2'>
                {SortOptions.map((val) => (
                  <label htmlFor={val}>
                    {val}
                    <input
                      className='m-1'
                      id={val}
                      type='radio'
                      value={val}
                      checked={settings.sortOrder === val}
                      onChange={() => { updateSortOrder(val); }}
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            <div className='w-full mt-6 flex flex-col justify-center items-center gap-2'>
              <button
                className='border-solid border-white border-2 px-2 rounded-lg'
                onClick={() => {
                  try {
                    localStorage.removeItem('setting');
                    window.location.reload();
                  } catch (error) { }
                }}
              >
                Reset settings
              </button>
              <button
                className='border-solid border-white border-2 px-2 rounded-lg'
                onClick={() => {
                  try {
                    localStorage.removeItem('itemList');
                    window.location.reload();
                  } catch (error) { }
                }}
              >
                Reset content
              </button>
            </div>
          </div>

        </div>

      </dialog>
    </>
  );
}
