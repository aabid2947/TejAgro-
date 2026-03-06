# Fix: react-native-screens Codegen Compatibility with React Native 0.78

## Problem

When building the release APK (`./gradlew assembleRelease`), Metro's Babel codegen plugin failed with:

```
Error: Unknown prop type for "onAttached": "undefined"
Error: Unknown prop type for "backTitleFontSize": "undefined"
Error: Unknown prop type for "insetType": "undefined"
```

**Root cause:** `react-native-screens@4.24.0` uses namespace-qualified TypeScript types
(e.g. `CT.Int32`, `CT.WithDefault`, `CT.DirectEventHandler`) imported via
`import type { CodegenTypes as CT } from 'react-native'`.

React Native's codegen parser (`@react-native/codegen`) resolves type names using
`typeAnnotation.typeName.name`. For a qualified name like `CT.Int32`, the AST node
is a `TSQualifiedName` where `.name` is `undefined` — so the parser cannot recognize
the type and throws `Unknown prop type`.

The same issue occurred with event handlers: `CT.DirectEventHandler<Readonly<{}>>` was
not recognized as an event (categorized by checking `typeName.name === 'DirectEventHandler'`),
so it fell through to prop parsing and failed.

---

## Affected Files

All files under `node_modules/react-native-screens/src/fabric/` (22 files total):

| File | Types fixed |
|------|------------|
| `ScreenStackHeaderConfigNativeComponent.ts` | `CT.Int32`, `CT.WithDefault`, `CT.DirectEventHandler`, `CT.UnsafeMixed` |
| `ScreenNativeComponent.ts` | `CT.Int32`, `CT.Float`, `CT.WithDefault`, `CT.DirectEventHandler` |
| `ModalScreenNativeComponent.ts` | `CT.Int32`, `CT.Float`, `CT.WithDefault`, `CT.DirectEventHandler` |
| `ScreenStackNativeComponent.ts` | `CT.WithDefault`, `CT.DirectEventHandler` |
| `SearchBarNativeComponent.ts` | `CT.Int32`, `CT.Float`, `CT.WithDefault`, `CT.DirectEventHandler` |
| `FullWindowOverlayNativeComponent.ts` | `CT.WithDefault` |
| `ScreenStackHeaderSubviewNativeComponent.ts` | `CT.WithDefault` |
| `safe-area/SafeAreaViewNativeComponent.ts` | `CT.WithDefault` + event types |
| `gamma/SplitViewHostNativeComponent.ts` | `CT.WithDefault`, `CT.Int32` |
| `gamma/SplitViewScreenNativeComponent.ts` | `CT.WithDefault`, `CT.Int32` |
| `gamma/stack/StackHostNativeComponent.ts` | `CT.WithDefault` |
| `gamma/stack/StackScreenNativeComponent.ts` | `CT.WithDefault`, `CT.DirectEventHandler` |
| `tabs/TabsHostNativeComponent.ts` | `CT.WithDefault`, `CT.Int32` |
| `tabs/TabsScreenNativeComponent.ts` | `CT.WithDefault`, `CT.Int32`, `CT.DirectEventHandler` |
| `tabs/TabsBottomAccessoryNativeComponent.ts` | `CT.WithDefault` |
| `tabs/TabsBottomAccessoryContentNativeComponent.ts` | `CT.WithDefault` |

---

## Changes Applied

### 1. Replace all `CT.*` qualified type references with direct names

**Before:**
```typescript
import type { CodegenTypes as CT, ViewProps, ColorValue } from 'react-native';

export interface NativeProps extends ViewProps {
  onAttached?: CT.DirectEventHandler<Readonly<{}>>;
  backTitleFontSize?: CT.Int32;
  backTitleVisible?: CT.WithDefault<boolean, 'true'>;
  headerLeftBarButtonItems?: CT.UnsafeMixed[];
}
```

**After:**
```typescript
import type { CodegenTypes as CT, ViewProps, ColorValue, DirectEventHandler } from 'react-native';

export interface NativeProps extends ViewProps {
  onAttached?: DirectEventHandler<null>;
  backTitleFontSize?: Int32;
  backTitleVisible?: WithDefault<boolean, 'true'>;
  headerLeftBarButtonItems?: UnsafeMixed[];
}
```

### 2. Replace `Readonly<{}>` event payload with `null`

Empty object event payloads (`Readonly<{}>`) were replaced with `null`, which is the
correct codegen-compatible form for events with no payload:

```typescript
// Before
type OnAttachedEvent = Readonly<{}>;
onAttached?: CT.DirectEventHandler<OnAttachedEvent>;

// After
onAttached?: DirectEventHandler<null>;
```

### 3. Add `DirectEventHandler` to imports

Where missing, `DirectEventHandler` was added to the `import type` statement from `react-native`.

---

## Additional Build Fixes

### Android toolchain upgrades (required by `androidx.core:core:1.17.0`)

| Setting | Before | After |
|---------|--------|-------|
| `compileSdkVersion` ([android/build.gradle](../../android/build.gradle)) | 35 | 36 |
| `buildToolsVersion` ([android/build.gradle](../../android/build.gradle)) | 35.0.0 | 36.0.0 |
| Android Gradle Plugin ([node_modules/@react-native/gradle-plugin/gradle/libs.versions.toml](../../node_modules/@react-native/gradle-plugin/gradle/libs.versions.toml)) | 8.8.0 | 8.9.1 |
| Gradle wrapper ([android/gradle/wrapper/gradle-wrapper.properties](../../android/gradle/wrapper/gradle-wrapper.properties)) | 8.10.2 | 8.11.1 |
| `android.suppressUnsupportedCompileSdk` ([android/gradle.properties](../../android/gradle.properties)) | 35 | 36 |

### Keystore

`android/app/TejAgro.keystore` was generated (was missing):

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore android/app/TejAgro.keystore \
  -alias TejAgro -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass 123456 -keypass 123456 \
  -dname "CN=TejAgro, OU=TejAgro, O=TejAgro, L=Unknown, S=Unknown, C=IN"
```

---

## Patch

The `react-native-screens` changes are preserved as a patch file:

```
patches/react-native-screens+4.24.0.patch
```

Apply with:
```bash
npx patch-package
```

Or automatically on every `npm install` by adding to `package.json`:
```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

---

## Versions

- `react-native`: 0.78.2
- `react-native-screens`: 4.24.0
- `@react-native/codegen`: (bundled with RN 0.78.2)
- Android Gradle Plugin: 8.9.1
- Gradle: 8.11.1
- compileSdk: 36
