import { Injectable } from '@angular/core';
import { IpcRenderer, IpcRendererEvent } from 'electron';

@Injectable({
  providedIn: 'root',
})
export class IpcService {
  private _ipc: IpcRenderer | undefined;

  constructor() {
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn("Electron's IPC was not loaded");
    }
  }

  public on(channel: string, listener: unknown): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.on(
      channel,
      listener as (event: IpcRendererEvent, ...args: any[]) => void
    );
  }

  public send(channel: string, message: unknown): void {
    if (!this._ipc) {
      return;
    }
    this._ipc.send(channel, message);
  }
}
