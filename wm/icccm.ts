import { IXClient, WMSizeHints, XPropMode } from "../shared/X";
import { log } from "./log";
import { IXWMEventConsumer, XWMContext, XWMWindowType } from "./wm";
import { getRawPropertyValue, internAtomAsync } from "./xutils";

enum WMStateValue {
  WithdrawnState = 0,
  NormalState = 1,
  IconicState = 3,
}

const SIZEOF_WMSizeHints = 72;

export async function createICCCMEventConsumer({ X }: XWMContext): Promise<IXWMEventConsumer> {
  const atoms = {
    WM_STATE: await internAtomAsync(X, "WM_STATE"),
  };

  function updateWindowState(wid: number): void {
    const wmStateBuffer = Buffer.alloc(8);
    wmStateBuffer.writeUInt32LE(WMStateValue.NormalState, 0);
    wmStateBuffer.writeUInt32LE(0, 4); // icon

    X.ChangeProperty(XPropMode.Replace, wid, atoms.WM_STATE, atoms.WM_STATE, 32, wmStateBuffer);
  }

  function removeWindowState(wid: number): void {
    X.DeleteProperty(wid, atoms.WM_STATE, (err) => {
      if (err) {
        log("Could not delete WM_STATE");
      }
    });
  }

  return {
    onMapNotify({ wid, windowType }) {
      if (windowType === XWMWindowType.Client) {
        updateWindowState(wid);
      }
    },

    onUnmapNotify({ wid, windowType }) {
      if (windowType === XWMWindowType.Client) {
        removeWindowState(wid);
      }
    },
  };
}

/** Obtains the WM_CLASS X property value for a window. */
export async function getWMClass(X: IXClient, wid: number): Promise<[string, string] | undefined> {
  const { data } = await getRawPropertyValue(X, wid, X.atoms.WM_CLASS, X.atoms.STRING);
  if (!data) {
    return undefined;
  }

  const wmClass: [string, string] = ["", ""];
  const firstNullByteIndex = data.indexOf(0);
  if (firstNullByteIndex > 0) {
    wmClass[0] = data.toString("utf8", 0, firstNullByteIndex);
  }
  if (firstNullByteIndex + 1 < data.length - 1) {
    wmClass[1] = data.toString("utf8", firstNullByteIndex + 1, data.length - 1);
  }
  return wmClass;
}

export async function getNormalHints(X: IXClient, wid: number): Promise<WMSizeHints | undefined> {
  const { data } = await getRawPropertyValue(X, wid, X.atoms.WM_NORMAL_HINTS, X.atoms.WM_SIZE_HINTS);

  if (!data || data.length < SIZEOF_WMSizeHints) {
    return;
  }

  const hints: WMSizeHints = {
    flags: data.readInt32LE(0),
    minWidth: data.readInt32LE(20),
    minHeight: data.readInt32LE(24),
    maxWidth: data.readInt32LE(28),
    maxHeight: data.readInt32LE(32),
    widthIncrement: data.readInt32LE(36),
    heightIncrement: data.readInt32LE(40),
    minAspect: [data.readInt32LE(44), data.readInt32LE(48)],
    maxAspect: [data.readInt32LE(52), data.readInt32LE(56)],
    baseWidth: data.readInt32LE(60),
    baseHeight: data.readInt32LE(64),
    gravity: data.readInt32LE(68),
  };
  return hints;
}
