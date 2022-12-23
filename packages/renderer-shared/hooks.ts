import { useCallback, useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";
import { IIconInfo } from "@electron-wm/shared/window";
import { RootState } from "./configureStore";
import { setPluginState } from "@electron-wm/shared/redux/pluginStateSlice";

type PluginStateUpdater<T> = (newValue: T) => void;

/** Returns the state object for a given plugin. */
export function usePluginState<T>(pluginName: string): [T | undefined, PluginStateUpdater<T | undefined>] {
  const store = useStore();

  const updater = useCallback(
    (newValue: T | undefined) => {
      store.dispatch(setPluginState({ pluginName, value: newValue }));
    },
    [pluginName, store]
  );

  return [useSelector((state: RootState) => state.pluginState[pluginName]) as T | undefined, updater];
}

export function useWindowSize(): { width: number; height: number } {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const resizeHandler = useCallback(() => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [resizeHandler]);

  return {
    width,
    height,
  };
}

export function useIconInfoDataUri(iconInfo: IIconInfo): string | undefined {
  const [dataUri, setDataUri] = useState<string | undefined>();

  useEffect(() => {
    if (!iconInfo) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = iconInfo.width;
    canvas.height = iconInfo.height;
    const context = canvas.getContext("2d")!;
    const iconImageData = context.createImageData(iconInfo.width, iconInfo.height);
    const iconData = iconInfo.data;
    for (let i = 0; i < iconData.length; i++) {
      iconImageData.data[i * 4 + 0] = (iconData[i] >>> 16) & 0xff; // R
      iconImageData.data[i * 4 + 1] = (iconData[i] >>> 8) & 0xff; // G
      iconImageData.data[i * 4 + 2] = iconData[i] & 0xff; // B
      iconImageData.data[i * 4 + 3] = (iconData[i] >>> 24) & 0xff; // A
    }
    context.putImageData(iconImageData, 0, 0);
    setDataUri(canvas.toDataURL());
  }, [iconInfo]);

  return dataUri;
}