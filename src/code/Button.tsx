import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type Props = React.ComponentPropsWithoutRef<'button'> & {
  onClickAnimation?: string;
  onLongClickAnimation?: string;
  onLongClick?: () => void;
}

export function Button({
  onClickAnimation = 'scale-[99%]',
  onLongClickAnimation = 'animate-[pulse_1s]  ease-[cubic-bezier(0.7, 0, 0.84, 0)]',
  className = '',
  onLongClick,
  ...props
}: Props) {
  const [downActive, setDownActive] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  const setDownInactive = useCallback(() => {
    if (downActive) {
      setDownActive(false);
    }
  }, [downActive]);

  const onTouchStart = useCallback((e) => {
    setDownActive(true);
    props.onTouchStart?.(e);
  }, [props]);

  const onMouseDown = useCallback((e) => {
    setDownActive(true);
    props.onMouseDown?.(e);
  }, [props]);

  const onClick = useCallback((e) => {
    setDownInactive();
    props.onClick?.(e);
  }, [props, setDownInactive]);

  const onMouseOut = useCallback((e) => {
    setDownInactive();
    props.onMouseOut?.(e);
  }, [props, setDownInactive]);

  const onBlur = useCallback((e) => {
    setDownInactive();
    props.onBlur?.(e);
  }, [props, setDownInactive]);

  const onTouchMove = useCallback((e) => {
    setDownInactive();
    props.onTouchMove?.(e);
  }, [props, setDownInactive]);

  // longClick logic, do this via useEffect to handle both
  // onMouseDown and onTouchStart being invoked for touch events
  useEffect(() => {
    if (!onLongClick) return () => { };
    if (!downActive) return () => { };

    timeoutId.current = setTimeout(onLongClick, 500);
    return () => clearTimeout(timeoutId.current);
  }, [downActive, onLongClick]);

  return (
    <button
      {...props}
      className={classNames(className, {
        [onClickAnimation]: downActive,
        [onLongClickAnimation]: !!onLongClick && downActive,
      })}
      onTouchStart={onTouchStart}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onMouseOut={onMouseOut}
      onBlur={onBlur}
      onTouchMove={onTouchMove}
    />
  );
}
