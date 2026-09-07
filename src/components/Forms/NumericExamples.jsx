import React from 'react';
import { NumberDemo, OtpDemo } from './NumericDemos';
import numberSource from './NumberField.jsx?raw';
import otpSource from './OtpField.jsx?raw';
import cssSource from './NumericForms.css?raw';
import demosSource from './NumericDemos.jsx?raw';
import inputSource from './Input.jsx?raw';
import formsSource from './Forms.css?raw';

export const numberFieldEntry = { id: 'builtin-number-field', name: 'Number Field', category: 'Forms', notes: 'Tactile numeric inputs with precise steps, formatted values, limits, and drag adjustment.' };
export const otpFieldEntry = { id: 'builtin-otp-field', name: 'OTP Field', category: 'Forms', notes: 'Verification codes with grouped digits, paste normalization, masking, and validation.' };
const example = (title, group, Component, props) => {
  const name = Component === NumberDemo ? 'NumberDemo' : 'OtpDemo';
  return { title, group, Demo: () => <Component {...props} />, code: `import { ${name} } from './NumericDemos';\n\n<${name} ${Object.entries(props).map(([key, value]) => `${key}={${JSON.stringify(value)}}`).join(' ')} />` };
};
const files = [['NumberField.jsx', numberSource], ['OtpField.jsx', otpSource], ['NumericForms.css', cssSource], ['NumericDemos.jsx', demosSource], ['Input.jsx', inputSource], ['Forms.css', formsSource]];
export const numericConfigs = {
  'number-field': {
    entry: numberFieldEntry, files,
    examples: [
      ...[['Integer quantity', 'quantity'], ['Custom decimal step', 'decimal'], ['Currency', 'currency'], ['Percentage', 'percent']].map(([title, variant]) => example(title, 'Values', NumberDemo, { variant })),
      ...[['Minimum & maximum', 'bounded'], ['Drag to adjust', 'scrub']].map(([title, variant]) => example(title, 'Adjustment', NumberDemo, { variant })),
      ...[['Empty', 'empty'], ['Invalid value', 'invalid'], ['Disabled', 'disabled']].map(([title, variant]) => example(title, 'States', NumberDemo, { variant })),
      ...[['Small', 'sm'], ['Standard', 'default'], ['Large', 'lg']].map(([title, size]) => example(title, 'Sizes', NumberDemo, { size })),
    ],
    usage: `import { NumberField } from './NumberField';\nimport { Field } from './Input';\n\n<Field label="Quantity">\n  <NumberField defaultValue={3} min={0} max={10} step={1} />\n</Field>`,
    guidance: 'Copy NumberField.jsx, NumericForms.css, and Forms.css. Use Field from Input.jsx for a visible label. Arrow keys and buttons adjust the value; the optional drag area provides another way to adjust it.',
    note: 'Formatting uses the French locale. Percent values use percentage points (15 means 15%). Empty values are null. Invalid text remains editable and blocks native form submission; out-of-range typed values must be corrected. Demo values stay on this page.',
    api: [['value / defaultValue', 'Controlled or initial number; null means empty', 'null'], ['onValueChange', 'Receives a number or null; invalid text is kept as a local draft', '—'], ['min / max', 'Bounds for buttons and drag; validates typed values', 'Unbounded'], ['step', 'Positive numeric increment; decimal steps supported', '1'], ['format', 'decimal · currency (EUR) · percent', 'decimal'], ['scrub', 'Dedicated horizontal drag area; 8px per increment', 'false'], ['size / disabled', 'sm · default · lg; disables input, buttons, and drag', 'default / false'], ['id / name / required / aria-*', 'Forwarded to the native input', '—']],
  },
  'otp-field': {
    entry: otpFieldEntry, files,
    examples: [
      example('4-digit code', 'Format', OtpDemo, { length: 4 }),
      example('6-digit code', 'Format', OtpDemo, { length: 6 }),
      example('Grouped digits', 'Format', OtpDemo, { grouped: true }),
      example('4-character key', 'Format', OtpDemo, { length: 4, alphanumeric: true }),
      example('Alphanumeric key', 'Format', OtpDemo, { alphanumeric: true, grouped: true }),
      example('Masked code', 'Privacy', OtpDemo, { masked: true }),
      example('Masked key', 'Privacy', OtpDemo, { masked: true, alphanumeric: true, grouped: true }),
      example('Paste a code', 'Input', OtpDemo, { variant: 'paste', grouped: true }),
      example('Normalize a key', 'Input', OtpDemo, { variant: 'paste', alphanumeric: true }),
      ...[['Partial entry', 'partial'], ['Code refused', 'rejected'], ['Placeholders', 'placeholder'], ['Disabled', 'disabled']].map(([title, variant]) => example(title, 'States', OtpDemo, { variant })),
      ...[['Standard', 'default'], ['Large', 'lg']].map(([title, size]) => example(title, 'Sizes', OtpDemo, { size })),
    ],
    usage: `import { OtpField } from './OtpField';\nimport { Field } from './Input';\n\n<Field label="Verification code">\n  <OtpField length={6} grouped onComplete={code => console.log(code)} />\n</Field>`,
    guidance: 'Copy OtpField.jsx, NumericForms.css, and Forms.css. Use Field from Input.jsx for the label and feedback. One native input supports selection, arrow keys, Backspace, paste, and one-time-code autofill across all visual slots.',
    note: 'Demo validation runs locally using the code shown beside each example. Completion calls onComplete; real verification belongs on your server. Spaces and punctuation are removed, full-width characters are normalized, and letters become uppercase. Masking only hides the displayed characters.',
    api: [['length', 'Number of characters; examples use 4 or 6', '6'], ['value / defaultValue / onValueChange', 'Controlled or initial string; change callback receives normalized code', 'Empty'], ['onComplete', 'Called when an edit produces a new complete code', '—'], ['alphanumeric', 'Accept A–Z and 0–9; otherwise digits only', 'false'], ['grouped / masked', 'Middle separator / password input', 'false'], ['size / placeholder', 'default · lg / character shown in empty slots', 'default / empty'], ['id / name / disabled / required / aria-*', 'Forwarded to the single native input', '—']],
  },
};
