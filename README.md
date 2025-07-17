# Aurora 4X Star System Map Visualizer

A React-based interactive visualization tool for Aurora 4X game data, featuring dynamic star system networks, population data visualization, and real-time database integration.

![Aurora 4X Map Visualizer](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)

## 📸 Screenshot

![Aurora 4X Map Visualizer Interface](https://i.imgur.com/aZbrYax.png)

## 🚀 Live Demo

**[View the live application here](https://thirionlogan.github.io/aurora-4x-react-map)**

## 📖 Overview

This project is an interactive web application that visualizes star system networks and population data from Aurora 4X game databases. It transforms complex game data into an intuitive, interactive map interface that allows players to explore their game universe through a modern web interface.

### Key Features

- **Interactive Star System Network**: Visualize connected star systems with hierarchical layouts
- **Population Data Integration**: Display colony information and population statistics
- **Real-time Database Processing**: Direct integration with Aurora 4X SQLite databases
- **Dynamic Visualization**: Zoom, pan, and search through star systems
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **TypeScript**: Full type safety and enhanced developer experience

## 🛠️ Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Database**: SQL.js for client-side SQLite database processing
- **Storage**: IndexedDB for local database persistence
- **Icons**: Lucide React for consistent iconography
- **Deployment**: GitHub Pages for static hosting

## 🎯 Core Functionality

### Database Integration

- Upload Aurora 4X SQLite database files directly in the browser
- Extract and process game data including star systems, connections, and population
- Persistent storage using IndexedDB for seamless user experience

### Interactive Visualization

- **Hierarchical Layout**: Star systems organized by connection depth from capital
- **Dynamic Sizing**: System nodes sized based on population and colony count
- **Color Coding**: Visual distinction between controlled and uncontrolled systems
- **Connection Lines**: Display jump gate connections between systems

### User Interface

- **Setup Modal**: Guided database upload and game/race selection
- **Interactive Controls**: Zoom, pan, and search functionality
- **Map Legend**: Clear visual indicators for different system types
- **Responsive Design**: Works across desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/thirionlogan/aurora-4x-react-map.git
   cd aurora-4x-react-map
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
   Navigate to [http://localhost:3000](http://localhost:3000)

### Usage

1. **Upload Database**: Drag and drop your Aurora 4X SQLite database file
2. **Select Game**: Choose the specific game you want to visualize
3. **Select Race**: Pick the race whose data you want to explore
4. **Explore**: Use the interactive map to explore star systems and colonies

## 📁 Project Structure

```
src/
├── components/
│   ├── MapLegend/           # Interactive map legend component
│   ├── SetupModal/          # Database upload and configuration modal
│   └── StarNetworkVisualization/  # Main visualization component
├── utils/
│   ├── capitalSystem.ts     # Capital system identification
│   ├── database.ts          # Database connection and query utilities
│   ├── populationData.ts    # Population data extraction
│   ├── systemConnections.ts # Star system connection processing
│   └── randomColor.ts       # Color generation utilities
└── App.tsx                  # Main application component
```

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run deploy` - Deploys to GitHub Pages

## 🎨 Features in Detail

### Star System Visualization

- **Hierarchical Layout**: Systems organized by distance from capital
- **Force-Directed Positioning**: Automatic layout optimization
- **Interactive Nodes**: Click to select and view system details
- **Connection Visualization**: Jump gate connections between systems

### Population Data Display

- **Colony Information**: Population counts and colony names
- **Race Control**: Visual indicators for system ownership
- **Population Totals**: Aggregate population per system

### User Experience

- **Persistent Settings**: Remembers game and race selections
- **Search Functionality**: Find specific star systems quickly
- **Zoom Controls**: Navigate large star networks efficiently
- **Responsive Design**: Works on desktop and mobile devices

## 🚧 Future Enhancements

- [ ] Dark/Light mode toggle
- [ ] Improved star system centering algorithms
- [ ] Additional data visualization options
- [ ] Export functionality for maps
- [ ] Performance optimizations for large databases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aurora 4X Community**: For the amazing 4X space strategy game
- **React Team**: For the excellent framework
- **Tailwind CSS**: For the utility-first CSS framework
- **SQL.js**: For client-side SQLite processing capabilities

---

**Built with ❤️ for the Aurora 4X community**
