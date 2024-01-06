import { applyMiddleware, Middleware } from "redux";
import { configureStore, Tuple } from "@reduxjs/toolkit";
import { composeWithStateSync } from "electron-redux/main";
import {
  configReducer,
  desktopReducer,
  pluginStateReducer,
  screenReducer,
  trayReducer,
  windowReducer,
} from "@bond-wm/shared";

export type ServerStore = ReturnType<typeof configureWMStore>;
export type ServerRootState = ReturnType<ServerStore["getState"]>;
export type ServerDispatch = ServerStore["dispatch"];

export function configureWMStore(middleware: Middleware[]) {
  const enhancer = composeWithStateSync(applyMiddleware(...middleware));

  const store = configureStore({
    reducer: {
      config: configReducer,
      desktop: desktopReducer,
      pluginState: pluginStateReducer,
      screens: screenReducer,
      tray: trayReducer,
      windows: windowReducer,
    },

    // Could try to tune this, but for now just disable it.
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),

    // TODO: Can/should this use getDefaultEnhancers?
    enhancers: () => {
      return new Tuple(enhancer);
    },
  });
  return store;
}
