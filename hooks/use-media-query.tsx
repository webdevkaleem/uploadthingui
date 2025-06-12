import * as React from "react";

/**
 * @description A hook that returns the value of a media query.
 * @param {string} query - The media query to check.
 * @returns {boolean} The value of the media query.
 */
export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
