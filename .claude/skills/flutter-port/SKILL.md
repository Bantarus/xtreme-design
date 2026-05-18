---
name: flutter-port
description: How dsx generates build/flutter/Tokens.dart, the filter that keeps it valid Dart, and the steps to consume it via theme extensions. Use only when implementing apps/mobile-flutter — not in scaffolding phases.
---

# Flutter port (dsx)

`apps/mobile-flutter/` is a placeholder. The Flutter port is **not** in scope for the scaffold phases. This skill documents what's already in place so the port, when implemented, can start at the right rung of the ladder.

## What you have today

Style Dictionary emits `build/flutter/Tokens.dart` from `tokens/core.tokens.json` + `tokens/semantic.tokens.json`:

```dart
class HeliosTokens {
    HeliosTokens._();

    static const colorPrimary = Color(0xFF7A3E0C);
    static const colorOnPrimary = Color(0xFFFFFFFF);
    static const colorSurface = Color(0xFFFAF8F3);
    // … plus radius* and spacing* dimensions
}
```

The class is filtered to **colors, spacing, radii** only. Font tokens are NOT emitted to Dart yet because Style Dictionary's `flutter/class.dart` format does not render `fontFamily` arrays as valid Dart. When the port lands, write a custom transform for typography or hand-author it. See [KNOWN-ISSUES.md](../../../KNOWN-ISSUES.md) for the rationale.

## Recommended port path

1. **Initialize the app.** `cd apps/mobile-flutter && flutter create .`
2. **Symlink or copy tokens.** Add a `pretokens` step to `pubspec.yaml` scripts that copies `build/flutter/Tokens.dart` into `lib/tokens/helios_tokens.dart`.
3. **ThemeExtension.** Wrap `HeliosTokens` in a `ThemeExtension<HeliosColors>` so widgets call `Theme.of(context).extension<HeliosColors>()!.primary`.
4. **Start with `Button`.** Mirror the web `apps/web/components/ui/button.tsx` variant API (default, secondary, outline, ghost, destructive). Use `HeliosTokens.colorPrimary`/`colorPrimaryHover` etc.
5. **Visual regression.** Use `integration_test` + `golden_toolkit` or `alchemist` to lock in screenshots — one golden per (variant × viewport).

## What to skip until later

- **Typography.** Pull font family/size/weight from a separate hand-maintained `lib/tokens/helios_text.dart` until Style Dictionary's typography output is fixed.
- **Dark mode.** dsx ships `tokens/themes/dark.tokens.json` for web. The Flutter port can run a second SD instance (mirroring the web pattern) to emit `Tokens.dark.dart`, or just store both palettes in one Dart class.
- **Dialog / DropdownMenu.** Web shadcn 4.7 uses `@base-ui/react`. Flutter has its own modal/menu idioms; do not try to mirror the API 1:1.
