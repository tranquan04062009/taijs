const fs = require('fs');

// Dữ liệu lịch sử
let historyData = [];

// Phân tích các dạng cầu phức tạp hơn
function detectComplexPatterns(historyData) {
  let patterns = [];
  let currentPattern = [];
  let prevResult = null;

  for (let i = 0; i < historyData.length; i++) {
    // Phân loại cầu 1-1
    if (currentPattern.length === 0 || historyData[i] === prevResult) {
      currentPattern.push(historyData[i]);
    } else {
      if (currentPattern.length > 1) {
        patterns.push({ type: 'bệt', sequence: currentPattern });
      } else {
        patterns.push({ type: '1-1', sequence: currentPattern });
      }
      currentPattern = [historyData[i]];
    }
    prevResult = historyData[i];
  }

  // Lưu lại chuỗi cầu cuối cùng
  if (currentPattern.length > 1) {
    patterns.push({ type: 'bệt', sequence: currentPattern });
  } else {
    patterns.push({ type: '1-1', sequence: currentPattern });
  }

  return patterns;
}

// Lưu lịch sử vào file
function saveHistoryToFile() {
  try {
    fs.writeFileSync('historyData.json', JSON.stringify(historyData));
    console.log("Dữ liệu lịch sử đã được lưu.");
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu lịch sử:", error);
  }
}

// Tải lịch sử từ file
function loadHistoryFromFile() {
  try {
    if (fs.existsSync('historyData.json')) {
      const data = fs.readFileSync('historyData.json', 'utf-8');
      historyData = JSON.parse(data);
      console.log("Dữ liệu lịch sử đã được khôi phục.");
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu lịch sử:", error);
  }
}

module.exports = { saveHistoryToFile, loadHistoryFromFile, detectComplexPatterns };