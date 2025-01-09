// utils.js - Các hàm tiện ích chung

// Kiểm tra tính hợp lệ của dữ liệu lịch sử
function validateHistoryData(data) {
  return data === 't' || data === 'x';
}

// Hàm xử lý lỗi trong dự đoán
function handlePredictionError(error) {
  console.error("Lỗi trong khi dự đoán:", error);
  return "x"; // Trả về 'Xỉu' nếu có lỗi xảy ra
}

module.exports = {
  validateHistoryData,
  handlePredictionError,
};