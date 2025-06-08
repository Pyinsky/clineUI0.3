# 📊 StockArt - AI-Powered Stock Analysis Platform

A modern, responsive web application for stock market analysis with an intuitive user interface and advanced features.

![StockArt Logo](https://img.shields.io/badge/StockArt-AI%20Powered-blue?style=for-the-badge&logo=trending-up)

## 🚀 Features

- **🔍 Smart Search**: Real-time company search with autocomplete suggestions
- **📈 Watchlist**: Personal stock tracking with live price updates
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🎨 Modern UI/UX**: Clean, professional interface with smooth animations
- **⚡ Fast Performance**: Lightweight and optimized for speed
- **🔒 Secure**: Built with security best practices

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Deployment**: Railway
- **Version Control**: Git, GitHub

## 📋 Quick Start

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/stockart-website.git
   cd stockart-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🚀 Deployment

### Railway Deployment

1. **Connect your GitHub repository to Railway**
2. **Railway will automatically detect the configuration**
3. **Deploy with one click!**

The app includes:
- ✅ `railway.json` for deployment configuration
- ✅ Health check endpoint at `/health`
- ✅ Production-ready Express server
- ✅ Security middleware (Helmet)
- ✅ Compression for better performance

### Environment Variables

No environment variables required for basic functionality.

## 📁 Project Structure

```
stockart-website/
├── 📄 package.json          # Project dependencies and scripts
├── 🖥️ server.js             # Express server configuration
├── ⚙️ railway.json          # Railway deployment settings
├── 📚 README.md             # Project documentation
├── 🚫 .gitignore            # Git ignore rules
├── 🏠 index.html            # Main HTML file
├── 📁 styles/               # CSS stylesheets
│   ├── main.css            # Core styles
│   └── animations.css      # Animation effects
└── 📁 scripts/              # JavaScript files
    └── main.js             # Main application logic
```

## 🎯 API Endpoints

### Health Check
```
GET /health
```
Returns server health status for monitoring.

### Stock Search
```
GET /api/stocks/search?q=apple
```
Returns filtered stock suggestions based on query.

## 🎨 Design Features

### 🎭 Interactive Elements
- **Collapsible Sidebar**: Toggle between expanded and collapsed states
- **Search Suggestions**: Real-time company/stock autocomplete
- **Hover Effects**: Smooth transitions and visual feedback
- **Loading States**: Professional loading animations

### 🎯 User Experience
- **Keyboard Navigation**: Full keyboard support with shortcuts
- **Accessibility**: Screen reader support and ARIA labels
- **Responsive Layout**: Adapts to all screen sizes
- **Performance**: Optimized for fast loading

### 🎨 Visual Design
- **Modern Color Scheme**: Professional dark theme
- **Custom Logo**: Branded stock chart icon
- **Typography**: Clean, readable fonts
- **Animations**: Smooth transitions and micro-interactions

## 🧩 Key Components

### Navigation Sidebar
- **Home**: Main dashboard
- **Discover**: Explore stocks and markets
- **Spaces**: Organized workspaces
- **Watchlist**: Personal stock tracking

### Search Interface
- **Smart Input**: "Ask any company..." placeholder
- **PRO Mode**: Advanced search features
- **Deep Research**: Enhanced analysis tools
- **Voice Search**: Audio input support

### Watchlist Features
- **Real-time Prices**: Live stock price updates
- **Color Coding**: Green/red for gains/losses
- **Quick Access**: One-click stock information

## 🔧 Development Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server
npm run build   # Build for production (static site)
npm test        # Run tests (placeholder)
```

## 📈 Performance Optimization

- **Compression**: Gzip compression for reduced file sizes
- **Security**: Helmet.js for security headers
- **Caching**: Static file caching strategies
- **Minification**: CSS and JS optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspired by modern financial platforms
- Icons and UI elements for professional appearance
- Performance optimization techniques from web best practices

## 📞 Support

For support, email support@stockart.com or open an issue on GitHub.

---

**Built with ❤️ for the financial community**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)
