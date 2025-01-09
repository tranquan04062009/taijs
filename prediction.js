const { buildLSTMModel, trainLSTMModel, predictLSTM } = require('./neuralNetwork');
const { detectComplexPatterns } = require('./dataManager');

// Tạo dữ liệu huấn luyện từ lịch sử và các mẫu cầu nhận diện được
function generateTrainingDataForLSTM(historyData) {
  const patterns = detectComplexPatterns(historyData);
  let trainingData = [];
  let labels = [];
  
  // Chuẩn bị dữ liệu cho LSTM
  patterns.forEach(pattern => {
    let features = pattern.sequence.map(value => value === 't' ? 1 : 0); // Chuyển đổi Tài (t) thành 1 và Xỉu (x) thành 0
    trainingData.push(features);
    labels.push(pattern.type === 'bệt' ? 1 : 0); // Nhãn: Cầu bệt = 1, cầu 1-1 = 0
  });

  return { trainingData, labels };
}

// Dự đoán kết quả Tài/Xỉu từ mô hình LSTM
async function advancedPrediction(historyData) {
  const { trainingData, labels } = generateTrainingDataForLSTM(historyData);
  await trainLSTMModel(trainingData, labels);

  // Dự đoán kết quả cho chuỗi mới
  const prediction = await predictLSTM(trainingData[trainingData.length - 1]);
  return prediction;
}

module.exports = { advancedPrediction };