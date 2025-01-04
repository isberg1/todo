/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Setter } from './type';

type ValidTypes<T> = string | number | boolean | object | Array<T>

export function usePersistState<T extends ValidTypes<T>>(val: T, key: string):
  [T, Setter<T>] {
  const [state, setStatePrivate] = useState<T>(val);
  const [ready, setReady] = useState(false);

  // get stored value at startup
  useEffect(() => {
    let v;
    try {
      const tmp = localStorage.getItem(key);
      if (tmp === null) {
        return;
      }
      v = JSON.parse(tmp);
    } catch (error) {
      return;
    } finally {
      setReady(true);
    }

    if (typeof v === typeof val) {
      setStatePrivate(v);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update persistent value on change
  useEffect(() => {
    if (!ready) return;

    try {
      const tmp = JSON.stringify(state);
      if (tmp !== localStorage.getItem(key)) {
        localStorage.setItem(key, tmp);
      }
    } catch (error) {
      //
    }
  }, [key, ready, state]);

  const setState = useCallback((settter: T | ((oldV: T) => T)) => {
    if (typeof settter !== 'function') {
      setStatePrivate(settter);
      return;
    }

    setStatePrivate((old) => {
      const a = settter(old);
      return a;
    });
  }, []);

  return [state, setState];
}
