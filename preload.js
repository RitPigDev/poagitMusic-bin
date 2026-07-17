// Nothing is exposed to the renderer on purpose. poagitMusic is a
// self-contained web app: file picking uses the native <input type="file">
// (which Chromium/Electron already routes through the real macOS Open
// dialog), drag-and-drop uses the standard HTML5 DataTransfer API, and the
// library is persisted with IndexedDB/localStorage — all of which work
// unmodified inside Electron's renderer with contextIsolation + sandbox on.
