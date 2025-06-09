const orderProduct = {};
var bot_state = 'search'; 

function appendMessage(sender, text, isHtml = false) {
  const timestamp = new Date().toLocaleTimeString();

  let msgHtml = "";

  if (sender === "Bot") {
    msgHtml = `
    <div class="flex items-start space-x-2 my-2">
      <img src="../static/images/bot.png" alt="Bot" class="w-8 h-8 rounded-full">
      <div class="bg-gray-100 text-black p-2 rounded-lg max-w-xs text-sm">
        ${text}
        <div class="text-[10px] text--500 mt-1">${timestamp}</div>
      </div>
    </div>`;
  } else {
    msgHtml = `
    <div class="flex justify-end my-2">
      <div class="bg-gray-200 text-gray-800 p-2 rounded-lg max-w-xs text-sm">
        ${escapeHtml(text)}
        <div class="text-[10px] text-gray-500 mt-1 text-right">${timestamp}</div>
      </div>
    </div>`;
  }

  $('#chat-box').append(msgHtml);
  $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
  saveChatSession();  // Save chat after each message
}
  
  function escapeHtml(text) {
    return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

$('#send-btn').click(function () {
  const message = $('#input').val().trim();
  if (!message) return;

  appendMessage("User", message);
  $('#input').val('');

  // Handle conversation states
  if (bot_state === 'address') {
    orderProduct.address = message;
    bot_state = 'payment-method';
    appendMessage("Bot", "Please enter your payment method (e.g., Cash on Delivery / UPI).");
    return;
  }

  if (bot_state === 'payment-method') {
    orderProduct.paymentMethod = message;
    bot_state = 'confirm-order';

    // Show confirmation
    appendMessage("Bot", `Please confirm your order: 
      <br>Product: ${orderProduct.name} - ₹${orderProduct.price}
      <br>Address: ${orderProduct.address}
      <br>Payment Method: ${orderProduct.paymentMethod}
      <br>Type 'yes' to confirm or 'no' to cancel.`);
    return;
  }

  if (bot_state === 'confirm-order') {
    if (message.toLowerCase() === 'yes') {
      appendMessage("Bot", "Your order has been placed! Thank you.");
      console.log(orderProduct)
    } else {
      appendMessage("Bot", "Order cancelled.");
    }


    bot_state = 'search';
    Object.keys(orderProduct).forEach(key => delete orderProduct[key]);
    return;
  }

  $.get(`http://127.0.0.1:5000/search`, { query: message }, function (data) {
    if (data.length === 0) {
      appendMessage("Bot", "No matching products found.");
    } else {
      data.forEach(item => {
        appendMessage("Bot", `<div class='rounded-md flex flex-col gap-2 shadow-sm p-2 mt-2 bg-white'>
          <span class='font-semibold text-black font-bold'>${item[1]} - ₹${item[2]}</span>
          <button id='buyBtn' onclick='proceedOrder(this)'
          data-product-id='${item[0]}' data-product-name='${item[1]}' data-product-price='${item[2]}'
          class='bg-blue-900 text-white py-1 px-2 rounded-lg '>Buy Now</button></div>`);
      });
    }
  }).fail(function () {
    appendMessage("Bot", "Error contacting server.");
  });
});

function proceedOrder(e) {
  orderProduct.id = $(e).data('product-id');
  orderProduct.name = $(e).data('product-name');
  orderProduct.price = $(e).data('product-price');

  bot_state = 'address';
  appendMessage("Bot", `Great! You've selected: ${orderProduct.name} - ₹${orderProduct.price}. 
  <br>Please enter your delivery address.`);
}

function saveChatSession() {
  const chatHtml = $('#chat-box').html();
  localStorage.setItem('chat_session', chatHtml);
}
$('#clear-chat').click(function () {
  localStorage.removeItem('chat_session');
  $('#chat-box').html('');
  appendMessage('Bot','Chat has been cleared. How can I help you?');
});


window.onload = function() {
  const savedChat = localStorage.getItem('chat_session');
  if (savedChat) {
    $('#chat-box').html(savedChat);
    $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
  }
  appendMessage('Bot','Hey there! Type to search the product');
};

$('#input').keypress(function (e) {
  if (e.which === 13) $('#send-btn').click();
});
