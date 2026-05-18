# mobile-swiftui (placeholder)

Future SwiftUI port. Not implemented in this phase.

Style Dictionary emits `build/ios/Tokens.swift` already (run `pnpm tokens`). When implementing:

1. Create a SwiftUI app in Xcode at this path.
2. Add `build/ios/Tokens.swift` to the target.
3. Expose tokens as `Color` and `CGFloat` extensions.
4. Port `Button` first.
