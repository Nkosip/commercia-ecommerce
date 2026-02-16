import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ATSChat = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I\'m your Afrika Tikkun shopping assistant 🤖 Browse our exclusive merchandise: hoodies, t-shirts, bottles, cups, drawstring bags, and caps. Every purchase supports youth empowerment!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Knowledge base with actual Afrika Tikkun merchandise
  const knowledgeBase = [
    // Products & Merchandise
    {
      keywords: ['products', 'what do you sell', 'what can i buy', 'merchandise', 'items', 'shop', 'available', 'stock'],
      response: 'We sell exclusive Afrika Tikkun branded merchandise:\n\n👕 Hoodies\n👔 T-Shirts\n🍾 Water Bottles\n☕ Cups/Mugs\n🎒 Drawstring Bags\n🧢 Caps\n\n100% of proceeds go directly to youth empowerment programs! Visit our shop to browse all items.',
      category: 'Products'
    },
    {
      keywords: ['hoodie', 'hoodies', 'sweater', 'sweatshirt', 'pullover'],
      response: 'Our Afrika Tikkun hoodies are perfect for showing your support! They\'re comfortable, high-quality, and every purchase helps empower youth. Check out our shop to see available colors and sizes!',
      category: 'Hoodies'
    },
    {
      keywords: ['t-shirt', 'tshirt', 'shirt', 'tee', 'top'],
      response: 'Our branded t-shirts are a great way to spread awareness about Afrika Tikkun\'s mission! Available in various sizes and colors. Browse the shop to see our current collection!',
      category: 'T-Shirts'
    },
    {
      keywords: ['bottle', 'water bottle', 'flask', 'drink bottle', 'hydrate'],
      response: 'Stay hydrated while supporting a great cause! Our Afrika Tikkun branded water bottles are perfect for everyday use. Durable and eco-friendly!',
      category: 'Bottles'
    },
    {
      keywords: ['cup', 'mug', 'coffee', 'tea', 'drinkware'],
      response: 'Start your day with purpose! Our Afrika Tikkun branded cups/mugs are perfect for your morning coffee or tea. Every sip supports youth empowerment!',
      category: 'Cups'
    },
    {
      keywords: ['bag', 'drawstring', 'backpack', 'sack', 'gym bag', 'tote'],
      response: 'Our drawstring bags are practical and stylish! Perfect for gym, school, or everyday use. Carry the Afrika Tikkun brand with pride while supporting our mission!',
      category: 'Bags'
    },
    {
      keywords: ['cap', 'hat', 'caps', 'headwear', 'baseball cap'],
      response: 'Complete your look with an Afrika Tikkun branded cap! Stylish, comfortable, and a conversation starter about our important work in communities!',
      category: 'Caps'
    },
    
    // Ordering & Checkout
    {
      keywords: ['how to buy', 'orders', 'how to order', 'purchase', 'checkout', 'add to cart', 'buy'],
      response: 'Easy ordering process:\n\n1️⃣ Browse our merchandise at /products\n2️⃣ Click "Add to Cart" on items you like\n3️⃣ Click the cart icon 🛒 (top right) to review\n4️⃣ Click "Proceed to Checkout"\n5️⃣ Fill in your shipping details\n6️⃣ Complete payment securely with Stripe\n\nThat\'s it! Your order will be on its way!',
      category: 'Ordering'
    },
    {
      keywords: ['cart', 'shopping cart', 'basket', 'view cart'],
      response: 'Your shopping cart is accessible via the cart icon 🛒 in the top navigation bar. You can add items, adjust quantities, or remove products. Once ready, proceed to checkout to complete your order!',
      category: 'Cart'
    },
    {
      keywords: ['size', 'sizes', 'sizing', 'fit', 'what size', 'measurements'],
      response: 'For hoodies and t-shirts, we offer standard sizes (S, M, L, XL, XXL). Check the size guide on each product page for specific measurements. If you\'re between sizes, we recommend sizing up for a more comfortable fit!',
      category: 'Sizing'
    },
    {
      keywords: ['color', 'colors', 'colours', 'what colors'],
      response: 'Our merchandise comes in various colors! The available colors for each item are shown on the product page. Popular choices include our signature red, black, white, and blue - all featuring the Afrika Tikkun branding!',
      category: 'Colors'
    },
    
    // Payment & Security
    {
      keywords: ['payment', 'pay', 'credit card', 'debit card', 'stripe', 'how to pay', 'payment methods'],
      response: 'We accept all major credit and debit cards (Visa, MasterCard, American Express) through our secure Stripe payment gateway. All transactions are encrypted and secure. We use ZAR (South African Rand) currency.',
      category: 'Payment'
    },
    {
      keywords: ['safe', 'secure', 'security', 'trust', 'encrypted'],
      response: 'Your security is our priority! We use Stripe, a world-leading payment processor. All transactions are encrypted with SSL/TLS. We never store your card details on our servers. Your information is completely safe!',
      category: 'Security'
    },
    
    // Shipping & Delivery
    {
      keywords: ['shipping', 'delivery', 'freight', 'postage', 'how long', 'when will i receive'],
      response: 'We offer FREE shipping on all orders! 🎉\n\n📦 Standard Delivery: 3-5 business days\n⚡ Express Delivery: 1-2 business days\n\nYou\'ll receive a tracking number via email once your order ships!',
      category: 'Shipping'
    },
    {
      keywords: ['track', 'tracking', 'where is my order', 'track order', 'package', 'status'],
      response: 'Track your order easily! After logging in, go to "My Orders" from your account menu. Click on your order to see the tracking number and current status. You can track it directly from there!',
      category: 'Tracking'
    },
    {
      keywords: ['location', 'deliver', 'ship to', 'south africa', 'where do you ship'],
      response: 'We currently ship within South Africa. Planning to expand internationally soon! If you\'re outside SA and interested in our merchandise, contact us at support@afrikatikkun.com for special arrangements.',
      category: 'Location'
    },
    
    // Returns & Refunds
    {
      keywords: ['return', 'refund', 'money back', 'send back', 'exchange', 'not satisfied'],
      response: 'We offer a 30-day return policy! If you\'re not completely satisfied:\n\n1️⃣ Go to "My Orders"\n2️⃣ Select the item\n3️⃣ Click "Return Item"\n4️⃣ Follow the instructions\n\nRefunds are processed within 5-7 business days after we receive the returned item.',
      category: 'Returns'
    },
    {
      keywords: ['cancel', 'cancel order', 'change order', 'modify order'],
      response: 'You can cancel orders within 1 hour of placement from your "My Orders" page. After 1 hour, please contact our support team at support@afrikatikkun.com for assistance with modifications or cancellations.',
      category: 'Cancellation'
    },
    {
      keywords: ['wrong size', 'exchange', 'different size', 'size exchange'],
      response: 'Need a different size? No problem! You can return the item within 30 days and place a new order for the correct size. Or contact support@afrikatikkun.com and we\'ll help arrange an exchange for you!',
      category: 'Exchange'
    },
    
    // Account & Login
    {
      keywords: ['account', 'sign up', 'register', 'create account', 'sign in', 'login'],
      response: 'Create an account to:\n✅ Track orders easily\n✅ Save your cart\n✅ Faster checkout\n✅ View order history\n\nClick "Sign Up" in the top navigation to get started. Already have an account? Click "Login"!',
      category: 'Account',
      action: () => navigate('/signup')
    },
    {
      keywords: ['orders', 'my orders', 'order history', 'past orders', 'previous purchases'],
      response: 'View all your orders in "My Orders" (accessible from your account menu after logging in). You can see order status, track shipments, download invoices, and initiate returns from there.',
      category: 'Orders'
    },
    
    // Mission & Impact
    {
      keywords: ['mission', 'purpose', 'why', 'afrika tikkun', 'cause', 'charity', 'nonprofit', 'about'],
      response: '🌍 Afrika Tikkun\'s Mission:\n\n100% of our merchandise proceeds support programs that empower youth and transform communities across Africa!\n\n📊 Our Impact:\n• 15,000+ youth empowered\n• 50+ communities supported\n• 85% education success rate\n\nEvery hoodie, t-shirt, or cap you buy makes a REAL difference!',
      category: 'Mission'
    },
    {
      keywords: ['impact', 'difference', 'help', 'community', 'youth', 'education', 'programs'],
      response: 'Your purchases directly fund:\n\n✅ Youth education programs\n✅ Skills development & training\n✅ Community health initiatives\n✅ Early childhood development\n✅ Leadership programs\n\nWe\'ve impacted 15,000+ youth across 50+ communities with an 85% education success rate. YOU make this possible!',
      category: 'Impact'
    },
    {
      keywords: ['donate', 'donation', 'contribute', 'give', 'support'],
      response: 'Thank you for wanting to support our mission! 💝\n\nEvery merchandise purchase is already a contribution - 100% of proceeds go to our programs. You can also:\n\n• Buy merchandise as gifts\n• Spread awareness about Afrika Tikkun\n• Share our mission with friends\n\nFor other ways to support, visit afrikatikkun.org',
      category: 'Support'
    },
    
    // Pricing & Discounts
    {
      keywords: ['price', 'cost', 'how much', 'expensive', 'cheap', 'affordable'],
      response: 'Our merchandise is affordably priced to make supporting our mission accessible to everyone! Prices vary by item:\n\n👕 Apparel (hoodies, t-shirts, caps)\n🎒 Accessories (bags, bottles, cups)\n\nCheck individual product pages for exact pricing. Remember - every Rand goes to empowering youth!',
      category: 'Pricing'
    },
    {
      keywords: ['discount', 'promo', 'coupon', 'code', 'sale', 'special offer', 'deal'],
      response: 'Sign up for our newsletter to receive exclusive promo codes and special offers! 🎁\n\nApply discount codes during checkout. We also run seasonal sales - keep an eye on our homepage for current promotions!\n\nEven at full price, you\'re making an impact!',
      category: 'Promotions'
    },
    {
      keywords: ['bulk', 'wholesale', 'large order', 'multiple', 'corporate'],
      response: 'Interested in bulk orders for your organization or event? 🎯\n\nWe offer special pricing for:\n• Corporate orders\n• Team merchandise\n• Event giveaways\n• School/university groups\n\nContact us at support@afrikatikkun.com with your requirements!',
      category: 'Bulk Orders'
    },
    
    // Support & Contact
    {
      keywords: ['contact', 'support', 'help', 'email', 'phone', 'customer service', 'assistance'],
      response: 'Need more help? We\'re here for you! 💬\n\n📧 Email: support@afrikatikkun.com\n📞 Phone: 1-800-ATS-HELP\n⏰ Available: 24/7\n\nYou can also use this chat for quick questions. We\'re always happy to assist!',
      category: 'Support'
    },
    {
      keywords: ['question', 'ask', 'inquiry', 'info', 'information'],
      response: 'I\'m here to help! I can answer questions about:\n\n🛍️ Our merchandise (hoodies, t-shirts, bottles, cups, bags, caps)\n📦 Orders, shipping & tracking\n💳 Payment & checkout\n🔄 Returns & exchanges\n❤️ Afrika Tikkun\'s mission & impact\n\nWhat would you like to know?',
      category: 'Help'
    }
  ];

  const quickReplies = [
    'What do you sell?',
    'How do I order?',
    'Shipping info',
    'Your mission',
    'Track my order'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getBotResponse = (userInput) => {
    const text = userInput.toLowerCase().trim();
    
    // Check for greetings
    if (text.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|howdy)\b/)) {
      return { 
        text: 'Hi there! 👋 Welcome to Afrika Tikkun! I can help you browse our merchandise (hoodies, t-shirts, bottles, cups, bags, caps), track orders, or tell you about our mission to empower youth. What interests you?', 
        category: 'Greeting' 
      };
    }
    
    if (text.match(/\b(thank|thanks|appreciate|awesome|great)\b/)) {
      return { 
        text: 'You\'re very welcome! 😊 Thank you for supporting Afrika Tikkun - every purchase empowers youth! Is there anything else I can help you with?', 
        category: 'Thanks' 
      };
    }
    
    if (text.match(/\b(bye|goodbye|see you|later|cheers)\b/)) {
      return { 
        text: 'Goodbye! 👋 Thank you for supporting Afrika Tikkun and empowering youth across Africa. Come back anytime - happy shopping! 💝', 
        category: 'Farewell' 
      };
    }

    // Check knowledge base
    for (let item of knowledgeBase) {
      for (let keyword of item.keywords) {
        if (text.includes(keyword)) {
          return {
            text: item.response,
            category: item.category,
            action: item.action
          };
        }
      }
    }

    // Default response with helpful suggestions
    return {
      text: 'I\'m here to help! I can assist with:\n\n🛍️ Merchandise (hoodies, t-shirts, bottles, cups, bags, caps)\n📦 Orders & Tracking\n💳 Payment & Checkout\n🚚 Shipping & Returns\n❤️ Our Mission & Impact\n\nWhat would you like to know more about?',
      category: 'General'
    };
  };

  const handleQuickReply = (text) => {
    setInput(text);
    handleSendMessage(text);
  };

  const handleSendMessage = (textToSend = input) => {
    const trimmedInput = textToSend.trim();
    if (!trimmedInput) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmedInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(trimmedInput);
      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse.text,
        category: botResponse.category,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Execute action if provided (like navigation)
      if (botResponse.action) {
        setTimeout(() => {
          botResponse.action();
        }, 500);
      }
    }, 800 + Math.random() * 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: 'Hello! I\'m your Afrika Tikkun shopping assistant 🤖 Browse our exclusive merchandise: hoodies, t-shirts, bottles, cups, drawstring bags, and caps. Every purchase supports youth empowerment!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`mb-4 w-96 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[600px]'
          } flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold text-xs">ATS</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Afrika Tikkun Assistant</h3>
                <p className="text-xs text-red-100">Merchandise & Support</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-8 h-8 hover:bg-red-800 rounded-lg transition-colors flex items-center justify-center"
                aria-label={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 hover:bg-red-800 rounded-lg transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div 
                        className={`rounded-2xl px-4 py-3 ${
                          msg.sender === 'user' 
                            ? 'bg-red-600 text-white' 
                            : 'bg-white text-gray-800 shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                        {msg.category && (
                          <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                            msg.sender === 'user' 
                              ? 'bg-red-700 text-red-100' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {msg.category}
                          </span>
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 px-2 ${
                        msg.sender === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 bg-white border-t border-gray-100">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {quickReplies.map((text, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(text)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full whitespace-nowrap transition-colors border border-red-200"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about merchandise, orders, or our mission..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim()}
                    className="p-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <button 
                    onClick={clearChat}
                    className="text-gray-500 hover:text-red-600 transition-colors font-medium"
                  >
                    Clear chat
                  </button>
                  <span className="text-gray-400">Press Enter to send</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setIsMinimized(false);
        }}
        className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group"
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-7 h-7 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.9C9.87812 3.30493 11.1801 2.99656 12.5 3H13C15.0843 3.11499 17.053 3.99477 18.5291 5.47087C20.0052 6.94696 20.885 8.91565 21 11V11.5Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-red-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              ?
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default ATSChat;