import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function useLocationChange(action) {
  const { listen } = useHistory();

  useEffect(() => {
    const unlisten = listen((location) => {
      action(location);
    });

    // remember, hooks that add listeners
    // should have cleanup to remove them
    return unlisten;
  }, [listen, action]);
}
