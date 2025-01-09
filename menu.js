// Menu chính với các lựa chọn
function mainMenu() {
  return {
    inline_keyboard: [
      [{ text: "Dự đoán Tài/Xỉu", callback_data: "tx" }],
      [{ text: "Thêm lịch sử Tài/Xỉu", callback_data: "addHistory" }],
      [{ text: "Lưu trữ dữ liệu", callback_data: "storage" }],
    ]
  };
}

// Menu con cho Tài/Xỉu
function txMenu() {
  return {
    inline_keyboard: [
      [{ text: "Tài", callback_data: "t" }, { text: "Xỉu", callback_data: "x" }],
      [{ text: "Hoàn tất nhập lịch sử", callback_data: "finish" }],
    ]
  };
}

module.exports = { mainMenu, txMenu };