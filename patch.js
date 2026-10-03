const fs = require('fs');
const file = 'components/templates/Architect/styles.css';
let css = fs.readFileSync(file, 'utf8');

css = css.replace(
  /\.hero-title \{\n  font-size: clamp\(3\.5rem, 5vw, 5rem\);\n  font-weight: 800;\n  line-height: 1\.05;\n  margin: 0 0 1rem;\n\}/,
  `.hero-title {\n  font-size: clamp(2.5rem, 4vw, 3.5rem);\n  font-weight: 800;\n  line-height: 1.1;\n  margin: 0 0 0.5rem;\n}`
);

css = css.replace(
  /\.hero-intro \{\n  font-size: 1\.1rem;\n  color: var\(--color-text-muted\);\n  margin-bottom: 2rem;\n\}/,
  `.hero-intro {\n  font-size: 1rem;\n  color: var(--color-text-muted);\n  margin-bottom: 1.5rem;\n}`
);

fs.writeFileSync(file, css);
