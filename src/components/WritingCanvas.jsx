import React from 'react';

export default function WritingCanvas({ value, onChange }) {
  return (
    <div className="flex flex-col flex-1 h-full bg-surfaceContainerLowest p-8 md:p-20 overflow-y-auto w-full border-r border-outlineVariant/15">
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col">
        <h2 className="text-display-sm font-space text-onSurfaceVariant/50 mb-8 uppercase tracking-widest text-sm">
          The Literary Soul
        </h2>
        <textarea
          className="flex-1 w-full bg-transparent text-body-lg text-onBackground font-newsreader leading-[1.8] resize-none focus:outline-none placeholder-onSurfaceVariant/50"
          placeholder="Begin writing your masterpiece here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck="false"
        />
      </div>
    </div>
  );
}
