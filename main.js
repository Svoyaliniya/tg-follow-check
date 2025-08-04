const TelegramBot = require("node-telegram-bot-api");

const TOKEN = '';
const CHANNEL_USERNAME = '';

const bot = new TelegramBot(TOKEN, {polling: true});

const inlineKeyboard = [[{text: 'Проверить!', callback_data: 'button_pressed',},],];
const options = {reply_markup: JSON.stringify({inline_keyboard: inlineKeyboard,}),};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    

    bot.sendAnimation(chatId, 'gif_example.gif')
    .then(() => {
        bot.sendMessage(chatId, `Ты уверен, что подписан на ${CHANNEL_USERNAME}? Давай проверим! 🚀`, options);  
    });
});

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.message.from.id;
    const messageId = query.message.message_id;
    const data = query.data;
  
    if (data === 'button_pressed') {
        try {
            const member = await bot.getChatMember(CHANNEL_USERNAME, userId);
            const status = member.status;
        
            if (['member', 'administrator', 'creator'].includes(status)) {
              bot.sendMessage(chatId, '✅ Вы подписаны на канал!');
            } else {
              bot.sendMessage(chatId, '❌ Вы не подписаны на канал. Пожалуйста, подпишитесь!');
            }
          } catch (err) {
            console.error('Ошибка при проверке подписки:', err);
            bot.sendMessage(chatId, '⚠️ Не удалось проверить подписку. Возможно, бот не админ в канале.');
          }
    }
  });