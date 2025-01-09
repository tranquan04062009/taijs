const TelegramBot = require('node-telegram-bot-api');
const { mainMenu, txMenu } = require('./menu');
const { combinedPredictionWithErrorHandling, retrainModel } = require('./prediction');
const { saveHistoryToFile, loadHistoryFromFile, saveTrainingData } = require('./dataManager');

const token = '7755708665:AAEOgUu_rYrPnGFE7_BJWmr8hw9_xrZ-5e0';  // Thay bằng token của bạn
const bot = new TelegramBot(token, { polling: true });

let historyData = [];  // Lịch sử người dùng
let trainingData = []; // Dữ liệu huấn luyện cho mô hình

// Tải lịch sử từ file khi bot khởi động
loadHistoryFromFile();

// Khi người dùng bắt đầu tương tác
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Chào bạn! Hãy chọn một tính năng từ menu.", { reply_markup: mainMenu() });
});

// Xử lý các callback từ các nút trong menu
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  switch(data) {
    case "tx": 
      // Hiển thị menu con Tài/Xỉu
      bot.sendMessage(chatId, "Chọn Tài hoặc Xỉu để nhập lịch sử.", { reply_markup: txMenu() });
      break;
    case "addHistory":
      // Yêu cầu người dùng nhập kết quả lịch sử tài/xỉu
      bot.sendMessage(chatId, "Hãy nhập kết quả Tài hoặc Xỉu (ví dụ: 't' hoặc 'x'):");
      bot.on("message", (msg) => {
        const userMessage = msg.text.toLowerCase();
        if (userMessage === 't' || userMessage === 'x') {
          historyData.push(userMessage);  // Thêm dữ liệu vào lịch sử
          bot.sendMessage(chatId, `Đã thêm ${userMessage === 't' ? 'Tài' : 'Xỉu'} vào lịch sử.`);
          saveHistoryToFile();  // Lưu lại lịch sử
        } else {
          bot.sendMessage(chatId, "Vui lòng nhập 't' hoặc 'x' để ghi nhận kết quả.");
        }
      });
      break;
    case "finish":
      // Dự đoán kết quả tài xỉu
      const prediction = combinedPredictionWithErrorHandling(historyData);
      bot.sendMessage(chatId, `Dự đoán kết quả tiếp theo: ${prediction === "t" ? "Tài" : "Xỉu"}`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Đúng", callback_data: "correct" }],
            [{ text: "Sai", callback_data: "incorrect" }]
          ]
        }
      });
      break;
    case "correct":
    case "incorrect":
      // Xác nhận đúng/sai và huấn luyện lại nếu sai
      const isCorrect = data === "correct";
      if (isCorrect) {
        saveTrainingData(historyData[historyData.length - 1]);  // Lưu kết quả đúng vào dữ liệu huấn luyện
        bot.sendMessage(chatId, "Dự đoán của bot là đúng. Dữ liệu đã được lưu.");
      } else {
        retrainModel(trainingData);  // Huấn luyện lại nếu sai
        bot.sendMessage(chatId, "Dự đoán của bot là sai. Bot sẽ huấn luyện lại với dữ liệu mới.");
      }
      saveHistoryToFile();  // Lưu lại lịch sử sau mỗi lần tương tác
      break;
    case "storage":
      // Quản lý lưu trữ dữ liệu
      saveHistoryToFile();
      bot.sendMessage(chatId, "Dữ liệu đã được lưu.");
      break;
    default:
      bot.sendMessage(chatId, "Lựa chọn không hợp lệ.");
      break;
  }
});