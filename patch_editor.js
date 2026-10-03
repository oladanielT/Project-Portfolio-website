const fs = require('fs');
const file = 'components/admin/Editor.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `                      <span>Template layout</span>
                      <select
                        value={content.template || "architect"}
                        onChange={(e) => update(["template"], e.target.value)}
                        className="editor-select"
                      >
                        <option value="architect">01 — The Architect (Blueprint / Technical)</option>
                        <option value="visionary">02 — The Visionary (Cinematic / Immersive)</option>
                        <option value="bento">03 — Bento Creator (Modular Blocks)</option>
                        <option value="noir">04 — Noir (Pitch Black Luxury)</option>
                        <option value="bold">05 — The Bold (Brutalist / Experimental)</option>
                        <option value="aurora">06 — Aurora (Organic Gradients)</option>
                        <option value="glass">07 — Glass Studio (Floating UI)</option>
                        <option value="memphis">08 — Neo Memphis (Playful Shapes)</option>
                        <option value="motion">09 — Motion Grid (3D Spatial)</option>
                        <option value="editorial">10 — Editorial (Magazine / Art Direction)</option>
                        <option value="elegant">-- Legacy Classic --</option>
                      </select>
                    </label>
                    <label className="editor-field">
                      <span>Color mode</span>
                      <select
                        value={content.colorMode || "light"}
                        onChange={(e) => update(["colorMode"], e.target.value)}
                        className="editor-select"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="pitch-black">Pitch Black (OLED)</option>
                        <option value="cream">Cream (Warm Neutral)</option>
                        <option value="vibrant">Vibrant</option>
                        <option value="sunset">Sunset (Orange/Pink)</option>
                        <option value="ocean">Ocean (Cyan/Blue)</option>
                        <option value="forest">Forest (Green)</option>
                        <option value="candy">Candy (Multi-color)</option>
                      </select>
                    </label>`;

const startIdx = content.indexOf('<span>Template layout</span>');
const endStr = '</select>\n                    </label>\n                  </Panel>';
const endIdx = content.indexOf(endStr, startIdx);

content = content.substring(0, startIdx) + replacement + '\n                  </Panel>' + content.substring(endIdx + endStr.length);
fs.writeFileSync(file, content);
