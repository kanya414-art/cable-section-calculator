// ケーブルデータ定義（抵抗率Ω·mm²/m、材質、許容電流目安）
const cableData = {
  "VVF": { resistivity: 0.01724, material: "銅", ampacity: { 1.6: 15, 2.0: 18, 3.5: 27, 5.5: 36, 8.0: 47 } },
  "IV":  { resistivity: 0.01724, material: "銅", ampacity: { 1.25: 17, 2.0: 23, 3.5: 33, 5.5: 46, 8.0: 60 } },
  "CV":  { resistivity: 0.01724, material: "銅", ampacity: { 5.5: 42, 8.0: 57, 14: 78, 22: 103, 38: 141 } },
  "CVT": { resistivity: 0.02826, material: "アルミ", ampacity: { 22: 94, 38: 125, 60: 168, 100: 228 } },
  "AE":  { resistivity: 0.02826, material: "アルミ", ampacity: { 14: 80, 22: 110, 38: 140, 60: 180 } },
  "HIV": { resistivity: 0.01724, material: "銅", ampacity: { 2.0: 24, 3.5: 33, 5.5: 46, 8.0: 60 } },
};

// ケーブルリストを選択欄に表示
const cableSelect = document.getElementById("cableType");
Object.keys(cableData).forEach(type => {
  const opt = document.createElement("option");
  opt.value = type;
  opt.textContent = type;
  cableSelect.appendChild(opt);
});

// 計算ボタン
document.getElementById("calcBtn").addEventListener("click", () => {
  const type = document.getElementById("cableType").value;
  const cross = parseFloat(document.getElementById("crossSection").value);
  const voltage = parseFloat(document.getElementById("voltage").value);
  const current = parseFloat(document.getElementById("current").value);
  const distance = parseFloat(document.getElementById("distance").value);

  if (!type || !cross || !voltage || !current || !distance) {
    alert("すべての項目を入力してください。");
    return;
  }

  const data = cableData[type];
  const rho = data.resistivity;
  const ampacityTable = data.ampacity;

  // 電線1本の抵抗（Ω）= 抵抗率 × 距離 ×2 ÷ 断面積
  const resistance = (rho * distance * 2) / cross;

  // 電圧降下 = 電流 × 抵抗
  const voltageDrop = current * resistance;
  const endVoltage = voltage - voltageDrop;

  // 許容電流（最も近いサイズ）
  const sizes = Object.keys(ampacityTable).map(Number);
  const nearestSize = sizes.reduce((a, b) => Math.abs(b - cross) < Math.abs(a - cross) ? b : a);
  const ampacity = ampacityTable[nearestSize] || "N/A";

  // 結果表示
  document.getElementById("result").innerHTML = `
    <p>ケーブル種類：${type}</p>
    <p>材質：${data.material}</p>
    <p>抵抗率：${rho} Ω·mm²/m</p>
    <p>断面積：${cross} mm²</p>
    <p>電圧降下：${voltageDrop.toFixed(2)} V</p>
    <p>末端電圧：${endVoltage.toFixed(2)} V</p>
    <p>許容電流の目安：約 ${ampacity} A</p>
  `;
});
