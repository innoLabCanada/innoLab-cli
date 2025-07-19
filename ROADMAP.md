# Ollama Integration Plan and Changelog

This document outlines the plan for integrating Ollama as a content generator within the `innoLab-cli` and details the changes that have already been implemented.

## Plan

### Phase 1: Core Integration (Completed)

The initial phase focuses on establishing a basic connection to an Ollama-hosted LLM and handling non-streaming text generation.

- **[x] Create `OllamaContentGenerator`:** Implement a new class that conforms to the existing `ContentGenerator` interface.
- **[x] Implement `generateContent`:** Implement the primary method for sending a prompt to the Ollama `/api/generate` endpoint and receiving a complete response.
- **[x] Add Configuration Options:**
  - **[x] Introduce `USE_OLLAMA` AuthType:** Add a new authentication type to distinguish Ollama requests.
  - **[x] Add CLI Flags:** Introduce `--ollama` to enable the integration and `--ollama-host` to specify the Ollama server address.
- **[x] Update Application Logic:** Modify the core configuration and content generator creation logic to recognize and use the new Ollama integration when activated by the CLI flags.
- **[x] Ensure Build Integrity:** Fix any TypeScript or build-related errors to ensure the project compiles successfully after the changes.

### Phase 2: Feature Parity and Refinement (Future Work)

This phase will focus on implementing the remaining features of the `ContentGenerator` interface and improving the overall integration.

- **[ ] Implement User-Friendly Model Selection:**
  - **[ ]** On startup in Ollama mode, fetch the list of available models from the Ollama `/api/tags` endpoint.
  - **[ ]** Prompt the user to select a model from the fetched list.
  - **[ ]** Use the selected model for all subsequent `generateContent` requests.
- **[ ] Enhance UI for Ollama Mode:**
  - **[ ]** Modify the CLI's main UI to display the currently active Ollama model name (e.g., "Ollama: llama3") instead of the Gemini model name.
- **[ ] Implement `generateContentStream`:** Support streaming responses from the Ollama API for a more interactive experience.
- **[ ] Implement `countTokens`:** Provide a mechanism for token counting compatible with Ollama models. This may require research into appropriate tokenization libraries.
- **[ ] Implement `embedContent`:** Add support for generating content embeddings using a model hosted on Ollama.
- **[ ] Add Testing:** Write comprehensive unit and integration tests for the `OllamaContentGenerator` to ensure its reliability and prevent regressions.
- **[ ] Improve Error Handling:** Enhance error handling for network issues, model availability, and other potential problems when interacting with the Ollama API.
- **[ ] Update Documentation:** Thoroughly document the Ollama integration for end-users.

---

## Changelog (as of 2025-07-19)

### New Files

- **`packages/core/src/core/ollamaContentGenerator.ts`**
  - Created this file to house the `OllamaContentGenerator` class.
  - Implemented the `generateContent` method, which sends a POST request to the Ollama `/api/generate` endpoint.
  - Added a constructor that reads the Ollama host from the `OLLAMA_HOST` environment variable, defaulting to `http://localhost:11434`.
  - Added placeholder implementations for `generateContentStream`, `countTokens`, and `embedContent` that throw `Method not implemented` errors.

### Modified Files

- **`packages/core/src/core/contentGenerator.ts`**
  - **`AuthType` Enum:** Added `USE_OLLAMA` as a new variant.
  - **`ContentGeneratorConfig` Type:** Added an optional `ollama?: boolean` property.
  - **`createContentGeneratorConfig()`:** Updated to recognize `AuthType.USE_OLLAMA` and set the `ollama` flag in the configuration.
  - **`createContentGenerator()`:** Updated to instantiate and return `OllamaContentGenerator` when the `authType` is `USE_OLLAMA`.

- **`packages/cli/src/config/config.ts`**
  - **CLI Flags:** Added the `--ollama` (boolean) and `--ollama-host` (string) flags using `yargs`.
  - **`CliArgs` Interface:** Updated to include the `ollama` and `ollamaHost` properties.
  - **`loadCliConfig()`:** Modified the function to check for the `--ollama` flag. If present, it sets the `selectedAuthType` to `USE_OLLAMA` and sets the `OLLAMA_HOST` environment variable based on the `--ollama-host` flag.

### Dependencies

- **`packages/core/package.json`**
  - Added `node-fetch` to the `dependencies`.
  - Added `@types/node-fetch` to the `devDependencies`.

### Build and Compilation

- Resolved multiple TypeScript errors that arose during the integration process, including:
  - Duplicate identifiers.
  - Missing `.js` extensions in relative import paths.
  - Type casting issues with `ContentListUnion`.
  - Incorrect object structures for API responses.
  - Handling of potentially `undefined` objects.
- Ensured the entire `innoLab-cli` project builds successfully after all changes were applied.
