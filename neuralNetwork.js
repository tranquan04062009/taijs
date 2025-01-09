const tf = require('@tensorflow/tfjs');

// Tạo mô hình LSTM để dự đoán các kết quả Tài/Xỉu
let model;

// Xây dựng mô hình LSTM
function buildLSTMModel() {
  model = tf.sequential();
  model.add(tf.layers.lstm({ units: 50, returnSequences: true, inputShape: [10, 1] }));
  model.add(tf.layers.lstm({ units: 50, returnSequences: false }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
  console.log("Mô hình LSTM đã được xây dựng.");
}

// Huấn luyện mô hình với dữ liệu lịch sử
async function trainLSTMModel(trainingData, labels) {
  const xs = tf.tensor3d(trainingData, [trainingData.length, 10, 1]); // Dữ liệu đặc trưng
  const ys = tf.tensor2d(labels, [labels.length, 1]); // Kết quả dự đoán

  await model.fit(xs, ys, { epochs: 50 });
  console.log("Mô hình LSTM đã được huấn luyện.");
}

// Dự đoán kết quả Tài/Xỉu từ mô hình LSTM
async function predictLSTM(input) {
  const xs = tf.tensor3d([input], [1, 10, 1]);
  const prediction = model.predict(xs);
  return prediction.dataSync()[0] > 0.5 ? 't' : 'x'; // Dự đoán Tài (t) hoặc Xỉu (x)
}

module.exports = { buildLSTMModel, trainLSTMModel, predictLSTM };