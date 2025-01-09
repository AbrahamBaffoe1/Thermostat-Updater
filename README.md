# Smart Thermostat Web Application

## Overview

This is a modern, responsive React-based smart thermostat application that allows users to control temperature and switch between heating and cooling modes. The application provides a sleek, user-friendly interface with real-time temperature adjustment capabilities.

## Features

- 🌡️ Temperature Control
  - Increment/decrement temperature in 0.5-degree increments
  - Mode-specific temperature ranges
  - Visual temperature feedback

- 🔄 Mode Switching
  - Toggle between Heat and Cool modes
  - Automatic default temperature adjustment when switching modes

- 🎨 Responsive Design
  - Full-screen coverage
  - Adaptive color schemes
  - Mobile and desktop friendly

- 🔒 Secure Communication
  - JWT authentication for API requests
  - Error handling for failed temperature updates

## Technologies Used

- React
- Tailwind CSS
- Lucide React Icons
- Fetch API for backend communication

## Prerequisites

- Node.js (v14 or later)
- npm or Yarn
- Backend thermostat API running on localhost:5001

## Installation

1. Clone the repository
```bash
git clone https://github.com/AbrahamBaffoe1/Thermostat-Updater.git
cd Thermostat-Updater
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
- Create a `.env` file in the project root
- Add your authentication token configuration

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Configuration

### API Endpoint
The application is configured to communicate with a local API:
- Base URL: `http://localhost:5001`
- Endpoints:
  - `PUT /api/thermostat/1` - Update temperature
  - `PUT /api/thermostat/1/mode` - Change thermostat mode

### Authentication
- Uses JWT token stored in `localStorage`
- Ensure your backend provides a valid authentication mechanism

## Customization

### Tailwind Configuration
Modify `tailwind.config.js` to customize:
- Color schemes
- Responsive breakpoints
- Additional utility classes

### Temperature Limits
Adjust temperature ranges in the `Thermostat` component:
- Heat mode: 15°C - 30°C
- Cool mode: 10°C - 26°C

## Deployment

1. Build the production version
```bash
npm run build
# or
yarn build
```

2. Deploy the contents of the `dist` directory to your preferred hosting platform

## Troubleshooting

- Ensure backend API is running
- Check browser console for any error messages
- Verify JWT token is correctly set in localStorage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact
