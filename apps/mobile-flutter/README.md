# mobile-flutter (placeholder)

Future Flutter port of the design system. Not implemented in this phase.

Style Dictionary emits `build/flutter/Tokens.dart` already (run `pnpm tokens`). When implementing:

1. Create a Flutter app with `flutter create .` at this path.
2. Add `build/flutter/Tokens.dart` to `lib/tokens.dart` (symlink or copy as part of `pnpm tokens` post-hook).
3. Wire `Tokens` into `ThemeExtension`s.
4. Port components incrementally, starting with `Button` and `Card`.
5. See `.claude/agents/port-flutter.md` for an agent that produces a checklist per component.
