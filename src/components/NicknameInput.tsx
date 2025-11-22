import React, { useState, useEffect } from 'react';
import type { NicknameWithLine } from '../types';
import './NicknameInput.css';

interface NicknameInputProps {
  nicknames: NicknameWithLine[];
  onNicknamesChange: (nicknames: NicknameWithLine[]) => void;
}

/**
 * Parse textarea content to extract nicknames and optional lines
 * Format: 
 * - "nickname" or "nickname/line"
 * - One entry per line
 * - Line values are in 1000s (e.g., 5 = 5000, 4.5 = 4500)
 * - Accepts both "." and "," as decimal separators
 * Examples:
 * - "gus" -> {nickname: "gus", line: undefined}
 * - "gus/5" -> {nickname: "gus", line: 5000}
 * - "gus/4.728" -> {nickname: "gus", line: 4728}
 * - "gus/4,728" -> {nickname: "gus", line: 4728}
 */
const parseNicknameText = (text: string): NicknameWithLine[] => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const nicknames: NicknameWithLine[] = [];

  lines.forEach(line => {
    if (line.includes('/')) {
      const [nickname, lineStr] = line.split('/').map(part => part.trim());
      
      // Replace comma with period for parsing, then multiply by 1000
      const normalizedLineStr = lineStr.replace(',', '.');
      const lineValue = parseFloat(normalizedLineStr);
      
      if (nickname && !isNaN(lineValue)) {
        nicknames.push({ nickname, line: lineValue * 1000 });
      } else if (nickname) {
        // If line part is invalid, just use nickname without line
        nicknames.push({ nickname, line: undefined });
      }
    } else {
      // No line specified
      nicknames.push({ nickname: line, line: undefined });
    }
  });

  return nicknames;
};

/**
 * Convert nicknames array back to text format for display
 * Line values are divided by 1000 for display
 */
const formatNicknamesAsText = (nicknames: NicknameWithLine[]): string => {
  return nicknames.map(n => {
    if (n.line !== undefined) {
      return `${n.nickname}/${n.line / 1000}`;
    }
    return n.nickname;
  }).join('\n');
};

const NicknameInput: React.FC<NicknameInputProps> = ({ nicknames, onNicknamesChange }) => {
  const [textValue, setTextValue] = useState('');

  // Initialize text value from nicknames prop
  useEffect(() => {
    setTextValue(formatNicknamesAsText(nicknames));
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextValue(newText);
    
    // Parse and update nicknames
    const parsedNicknames = parseNicknameText(newText);
    onNicknamesChange(parsedNicknames);
  };

  return (
    <div className="nickname-input-container">
      <h3>Players to Include</h3>
      <p className="nickname-hint">
        Enter one player per line. Format: <code>nickname</code> or <code>nickname/line</code> (line in 1000s)
      </p>
      
      <textarea
        value={textValue}
        onChange={handleTextChange}
        placeholder="gus/5&#10;febe&#10;dstraume/4.5&#10;abood"
        className="nickname-textarea"
        rows={6}
      />

      {nicknames.length > 0 && (
        <div className="nickname-summary">
          <p className="summary-text">
            <strong>{nicknames.length}</strong> player(s) added
            {' '}({nicknames.filter(n => n.line !== undefined).length} with line)
          </p>
        </div>
      )}
    </div>
  );
};

export default NicknameInput;
