# mobile-compose (placeholder)

Future Jetpack Compose port. Not implemented in this phase.

Style Dictionary emits `build/compose/Tokens.kt` already (run `pnpm tokens`). When implementing:

1. Scaffold an Android Studio project here.
2. Copy `build/compose/Tokens.kt` into `app/src/main/java/...`.
3. Wrap tokens into a `MaterialTheme` extension.
4. Port `Button` first.
5. See `.claude/agents/port-compose.md` for the per-component checklist.
