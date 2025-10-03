# 🌌 AI/ML Exoplanet Detection Platform

A fully interactive 3D web interface for exploring the universe from Earth to distant exoplanets, combining AI/ML capabilities with immersive space visualization.

## ✨ Features

### 🚀 Navigation & Animation Flow

- **Earth View**: Detailed 3D model of Earth with continents, oceans, and subtle effects
- **Solar System**: Zoom out to see all planets orbiting the Sun with realistic positioning
- **Galaxy View**: Experience the Milky Way with spiral arms and star clusters
- **Universe View**: Explore neighboring galaxies forming clusters and superclusters
- **Exoplanet System**: Zoom into target exoplanet systems with their stars and orbits

### 🎨 Visual Style & Environment

- Low-poly, stylized 3D models for planets, stars, and galaxies
- Dark space background with subtle stars and nebulae
- Color-coded planets with realistic appearances
- Subtle orbit animations and particle effects
- Smooth transitions with curved camera paths

### 📊 3D Dashboard & User Interface

#### Left Side Panels
- **Dashboard Statistics**
  - Total confirmed exoplanets: 5,537
  - Candidates under investigation: 8,924
  - False positives: 2,341
  
- **Quick Actions** (visible on Earth & Solar System views)
  - Upload Data
  - Train Model
  - View Results

#### Right Side Panels
- **Data Upload Section** (visible on Earth & Exoplanet views)
  - Drag-and-drop for CSV/JSON files
  - Auto-clean data toggle
  - Train/Test split slider (50%-100%)
  - Upload & Process button with glow effect
  
- **Recent Discoveries Carousel** (visible on Galaxy view)
  - 3D rotating planet models
  - Discovery year and type information
  - Interactive carousel navigation

#### Bottom Panels
- **Exoplanet Explorer** (visible on Galaxy, Universe & Exoplanet views)
  - Interactive search functionality
  - Filterable exoplanet database
  - Real-time data display with status badges
  - Detailed information cards:
    - Radius (Earth radii)
    - Orbital period (days)
    - Planet type (Terrestrial, Super Earth, Mini Neptune, etc.)
    - Distance (light years)
    - AI confidence scores

- **Model Training Interface** (visible on Earth & Exoplanet views)
  - Model selection dropdown (Random Forest, Neural Network, SVM, Gradient Boosting)
  - Hyperparameter sliders:
    - Epochs (10-200)
    - Learning Rate (0.001-0.1)
  - Real-time training progress bar
  - Performance metrics display:
    - Accuracy: 94.3%
    - Precision: 92.1%
    - Recall: 91.8%
  - Animated train button with glow effect

### 🎮 Interactivity & Controls

- **Mouse Controls**:
  - Drag to rotate view
  - Scroll to zoom in/out
  - Click objects to focus
  
- **Navigation Controls** (bottom center):
  - Earth view button
  - Solar System view button
  - Galaxy view button
  - Universe view button
  - Exoplanet view button
  
- **Scale Indicator** (right side):
  - Real-time zoom level display
  - Distance measurements for each scale
  - Visual progress indicator
  
- **UI Toggle** (top right):
  - Show/Hide all UI panels
  - Eye icon for quick access

### 🎭 Animation & Immersion

- Smooth fade-in/fade-out transitions for UI elements
- Curved, smooth camera paths for zoom transitions
- Natural scaling for objects during view changes
- Planet rotation and orbital animations
- Particle effects:
  - Purple particles in Universe view (3,000 particles)
  - Blue particles in Galaxy view (2,000 particles)
  - Yellow particles in Exoplanet view (1,000 particles)
- Hover animations for cards and buttons
- Pulsing glow effects for interactive elements

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **React Three Fiber** & **Three.js** for 3D rendering
- **@react-three/drei** for 3D helpers
- **Framer Motion** for smooth animations
- **Radix UI** & **shadcn/ui** for UI components
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for fast development

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ or Bun
- npm or bun package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development
The application runs on `http://localhost:8080` by default.

## 📁 Project Structure

```
src/
├── components/
│   ├── SpaceJourney.tsx          # Main 3D canvas and view orchestration
│   ├── Earth.tsx                 # Earth 3D model
│   ├── SolarSystem.tsx           # Solar system with planets
│   ├── GalaxyView.tsx            # Milky Way galaxy
│   ├── UniverseView.tsx          # Universe with galaxy clusters
│   ├── ExoplanetSystem.tsx       # Exoplanet system with star and planets
│   ├── ParticleField.tsx         # Animated particle effects
│   ├── Controls.tsx              # Navigation buttons
│   ├── Dashboard.tsx             # Statistics cards
│   ├── DataUploadSection.tsx    # Data upload interface
│   ├── ModelTraining.tsx         # AI model training panel
│   ├── ExoplanetExplorer.tsx    # Exoplanet database browser
│   ├── RecentDiscoveries.tsx    # Discovery carousel
│   ├── ScaleIndicator.tsx       # Zoom level indicator
│   ├── QuickActions.tsx         # Quick action buttons
│   ├── UIToggle.tsx             # UI visibility toggle
│   └── ui/                       # shadcn/ui components
├── pages/
│   └── Index.tsx                 # Main page
├── lib/
│   └── utils.ts                  # Utility functions
└── index.css                     # Global styles

## 🎨 Design Philosophy

### Immersive Experience
The platform is designed to make users feel like they're taking a real space journey, starting from Earth and exploring the universe down to target exoplanets.

### Educational Value
Each view provides context-appropriate information about scale, distances, and celestial objects, making it educational for researchers and casual users alike.

### Clean & Minimalistic
The UI uses floating glass-morphism panels that don't obstruct the 3D views, maintaining clarity and focus on the space visualization.

### Performance Optimized
- Conditional rendering of UI elements based on current view
- Efficient particle systems with optimized counts
- Smooth 60 FPS animations
- Optimized 3D models for web performance

## 🎯 Use Cases

1. **Research & Education**
   - Visualize exoplanet data in 3D space
   - Understand scale relationships in the universe
   - Teach astronomy concepts interactively

2. **AI/ML Development**
   - Upload and process exoplanet datasets
   - Train machine learning models
   - Visualize model performance metrics

3. **Data Exploration**
   - Browse confirmed exoplanets
   - Filter and search planetary systems
   - Analyze discovery trends

4. **Public Engagement**
   - Share space exploration with general audiences
   - Create immersive presentations
   - Inspire interest in astronomy and space science

## 🔮 Future Enhancements

- Real NASA exoplanet API integration
- More detailed 3D models with textures
- VR/AR support for immersive viewing
- Real-time collaborative exploration
- Advanced filtering and comparison tools
- Export capabilities for research data
- Animation recording and playback
- Custom planet creation and simulation

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- NASA Exoplanet Archive for data inspiration
- Three.js community for 3D rendering capabilities
- shadcn/ui for beautiful UI components
- React Three Fiber for seamless React-Three.js integration

---

**Built with ❤️ for space exploration and AI/ML research**
