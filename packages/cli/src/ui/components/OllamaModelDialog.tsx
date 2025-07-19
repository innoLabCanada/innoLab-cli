/**
 * @license
 * Copyright 2025 innoLab.ca
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

interface OllamaModelDialogProps {
  models: string[];
  onSelect: (model: string) => void;
}

export const OllamaModelDialog = ({
  models,
  onSelect,
}: OllamaModelDialogProps) => {
  const items = models.map((model) => ({
    label: model,
    value: model,
  }));

  return (
    <Box flexDirection="column">
      <Text>Select an Ollama model:</Text>
      <SelectInput items={items} onSelect={(item) => onSelect(item.value)} />
    </Box>
  );
};
