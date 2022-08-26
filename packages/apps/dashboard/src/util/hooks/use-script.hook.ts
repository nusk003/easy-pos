import { useEffect, useState } from 'react';

const cachedScripts: Array<string> = [];

export const useScript = (
  src: string,
  props: Partial<HTMLScriptElement>
): [boolean, boolean] => {
  const [state, setState] = useState({
    loaded: false,
    error: false,
  });

  useEffect((): void | (() => void | undefined) => {
    if (cachedScripts.includes(src)) {
      setState({
        loaded: true,
        error: false,
      });
    } else {
      cachedScripts.push(src);

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      if (props) {
        if (props.id) {
          script.id = props.id;
        }
      }

      const onScriptLoad = (): void => {
        setState({
          loaded: true,
          error: false,
        });
      };

      const onScriptError = (): void => {
        const index = cachedScripts.indexOf(src);
        if (index >= 0) cachedScripts.splice(index, 1);
        script.remove();

        setState({
          loaded: true,
          error: true,
        });
      };

      script.addEventListener('load', onScriptLoad);
      script.addEventListener('error', onScriptError);

      document.body.appendChild(script);

      return (): void => {
        script.removeEventListener('load', onScriptLoad);
        script.removeEventListener('error', onScriptError);
      };
    }
    return undefined;
  }, [props, src]);

  return [state.loaded, state.error];
};
