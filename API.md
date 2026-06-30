# api function listing

## WindowHandle
class — src/Apis/iSApi.ts

### fromHWnd(hwnd)
src/Core/windowhelpers.ts (`getSymbolByHWnd`)

### close()
src/Core/windowhelpers.ts (`closeWindow`)

### minimize()
src/Core/windowhelpers.ts (`minimize`)

### bringupwards()
src/Core/windowhelpers.ts (`bringupwards`)

### getTitle()
src/Core/windowhelpers.ts (`windows`)

### getContent()
src/Core/windowhelpers.ts (`windows`)

### setContent(content)
src/Core/windowhelpers.ts (`setContent`)

### dimensions()
src/Core/windowhelpers.ts (`getDimensions`)

### setDimensions(d)
src/Core/windowhelpers.ts (`setDimensions`)

### position()
src/Core/windowhelpers.ts (`getPosition`)

### getMousePosition()
src/Core/windowhelpers.ts (`getCurrentMousePosition`)

### getMousePositionRelative()
src/Core/windowhelpers.ts (`getMousePositionRelativeToWindow`)

### getMouseInfo()
src/Core/windowhelpers.ts (`getCurrentMousePosition`, `getMousePositionRelativeToWindow`)

### setPosition(pos)
src/Core/windowhelpers.ts (`setPosition`)

### setCenter(center)
src/Core/windowhelpers.ts (`setCenter`)

### corners()
src/Core/windowhelpers.ts (`getCorners`)

### draw(fn)
src/Core/overlay.ts (`drawToWindow`)

## systems
src/Core/systems.ts

### setWallpaper(url)

### setWallpaperWithBlob(blob)

### setWisp(url)

### wFetchText(url)

### wFetchBlob(url)

## registry
src/Apis/RegistryApi.ts

### RegistryValueHandle
- `value` (getter)
- `type` (getter)
- `loaded` (getter)

### RegistryInstanceAccess
- `getKey(path)`
- `_load(path)`
- `_save(record)`
- `_write(path, name, value)`
- `_deleteValue(path, name)`
- `_deleteKey(path)`

### RegistryKey
- `getKey(sub)`
- `getValue(name)`
- `setValue(name, value)`
- `deleteValue(name)`
- `deleteKey()`
- `list()`
- `createKey()`

## fs
src/Apis/FileSystemApi.ts

### FileHandle
- `read()`
- `write(data)`
- `append(data)`
- `delete()`

### DirectoryHandle
- `list()`
- `createFile(name)`
- `createDirectory(name)`
- `delete()`

### FileSystemAccess
- `exists(path)`
- `isFile(path)`
- `isDirectory(path)`
- `createDirectory(path)`
- `deleteDirectory(path)`
- `listDirectory(path)`
- `createFile(path)`
- `deleteFile(path)`
- `openFile(path)`
- `updateFileMeta(path, data)`
- `rename(oldPath, newPath)`

## spawn
src/Core/windowhelpers.ts (reexported from src/Apis/iSApi.ts)
