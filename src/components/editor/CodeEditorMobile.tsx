import React from 'react';
import { View, TextInput, ScrollView, StyleSheet } from 'react-native';
import { CODE_LANGUAGES } from '../../utils/constants';

interface CodeEditorMobileProps {
  code: string;
  onChangeCode: (code: string) => void;
  language: string;
  readOnly?: boolean;
}

const CodeEditorMobile: React.FC<CodeEditorMobileProps> = ({
  code,
  onChangeCode,
  language,
  readOnly = false
}) => {
  // Find language details
  const languageInfo = CODE_LANGUAGES.find(lang => lang.id === language);
  
  return (
    <View className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TextInput
            value={code}
            onChangeText={onChangeCode}
            multiline
            editable={!readOnly}
            className="font-mono text-gray-100 p-4"
            style={styles.codeInput}
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  codeInput: {
    minHeight: 200,
    minWidth: 300,
  },
});

export default CodeEditorMobile;