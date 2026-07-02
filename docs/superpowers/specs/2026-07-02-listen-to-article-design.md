# Specification - Listen to Article Feature (Web Speech API)

Implement a client-side text-to-speech (TTS) audio engine utilizing the browser's native Web Speech API (`SpeechSynthesis`) to read article content aloud. This is a local execution layout that requires zero server-side generation, API keys, or SaaS costs.

## Requirements & Goals
- Extract readable text segments dynamically from Sanity's Portable Text blocks.
- Provide a Play/Pause/Stop interface via an inline metadata button and a sticky floating player.
- Offer adjustable playback speeds (0.75x to 2x) and a system voice selector.
- Implement robust cleanup triggers (navigating away, component unmounting, error bounds) to cancel ongoing synthesized utterances.

## Proposed Changes

### Utilities Layer

#### [NEW] [extractArticleText.ts](file:///e:/askt/lib/speech/extractArticleText.ts)
- Utility to map Sanity Portable Text block objects into a unified plain text string.
- Ignores code listings, embeds, and custom non-readable block types.

#### [NEW] [splitSpeechChunks.ts](file:///e:/askt/lib/speech/splitSpeechChunks.ts)
- Splits plain text into small chunks (under 200 characters) at natural sentence boundaries (`.`, `!`, `?`).
- Resolves engine freeze crashes on long text sequences in mobile browsers.

#### [NEW] [estimateReadingTime.ts](file:///e:/askt/lib/speech/estimateReadingTime.ts)
- Calculates estimated total reading time and remaining durations based on word count and current speech rates.

---

### Hooks Layer

#### [NEW] [useSpeechVoices.ts](file:///e:/askt/hooks/useSpeechVoices.ts)
- Custom React hook to safely retrieve available browser `SpeechSynthesisVoice` objects on mount.
- Handles asynchronous loaded voices and filters for English/matching language locales.

#### [NEW] [useSpeechProgress.ts](file:///e:/askt/hooks/useSpeechProgress.ts)
- Computes speech timeline progress (elapsed time, percentage) based on character counts and speeds.

#### [NEW] [useSpeechSynthesis.ts](file:///e:/askt/hooks/useSpeechSynthesis.ts)
- Root controller wrapping browser `window.speechSynthesis`.
- Manages queue states, rates, voices, and handles cleanups.

---

### Component Layer

#### [NEW] [ListenButton.tsx](file:///e:/askt/components/speech/ListenButton.tsx)
- Trigger button located under the article metadata section.
- Indicates play/pause status and triggers speech initialization.

#### [NEW] [ArticleSpeechPlayer.tsx](file:///e:/askt/components/speech/ArticleSpeechPlayer.tsx)
- Responsive sticky widget: bottom-right float on desktop, fixed bottom panel on mobile.
- Houses playback controllers, speed toggle menus, voice selectors, and progress status.

#### [NEW] [PlaybackControls.tsx](file:///e:/askt/components/speech/PlaybackControls.tsx)
- Standard action triggers (Play, Pause, Stop, Volume).

#### [NEW] [SpeedSelector.tsx](file:///e:/askt/components/speech/SpeedSelector.tsx)
- Dropdown selector for rate multipliers (0.75x to 2.0x).

#### [NEW] [VoiceSelector.tsx](file:///e:/askt/components/speech/VoiceSelector.tsx)
- Dropdown mapping system-detected speech voices.

---

### Layout Integrations

#### [MODIFY] [ArticleLayout.tsx](file:///e:/askt/components/layout/ArticleLayout.tsx)
- Accept `content: any[]` (raw Portable Text) from the parent article page.
- Render the `<ListenButton />` in the metadata list.
- Render the sticky `<ArticleSpeechPlayer />` fixed at the container base.

#### [MODIFY] [page.tsx](file:///e:/askt/app/learn/[slug]/page.tsx)
- Pass the article's Portable Text `content` property to `<ArticleLayout />`.

---

## Verification Plan

### Automated Verification
- Run typescript compilation diagnostics: `npx tsc --noEmit`
- Run local Next.js production build: `npm run build`

### Manual Verification
- Verify that clicking "Listen to Article" launches the sticky player.
- Verify that selecting system voices and speeds changes speech properties dynamically.
- Navigate to another learn article page or hub link and verify speech halts immediately.
