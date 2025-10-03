# Exoplanet Data Entry System

## Overview
A fully interactive and user-friendly exoplanet data entry system that allows users to manually input exoplanet parameters for AI/ML model training and classification.

## Architecture
This implementation follows the **Model-View-Controller (MVC)** pattern:

### Model (`src/models/ExoplanetModel.ts`)
- **Data Structure**: Defines the `ExoplanetData` interface with all relevant parameters
- **Validation Logic**: Validates input data with proper range checks
- **Business Logic**: 
  - Calculate habitability scores
  - Determine planet types based on physical properties
  - Format data for ML model consumption
  - Generate unique IDs

### View (`src/components/ExoplanetDataEntry.tsx`)
- **User Interface**: Clean, intuitive form with organized sections
- **Input Fields**: All NASA exoplanet parameters with tooltips
- **Validation Feedback**: Real-time error messages
- **Visual Design**: Space-themed with glassmorphism effects
- **Responsive Layout**: Works on all screen sizes

### Controller (`src/controllers/ExoplanetController.ts`)
- **API Integration**: Handles data persistence (with fallback to localStorage)
- **CRUD Operations**: Create, Read, Update, Delete exoplanet entries
- **ML Integration**: Submit data for model training
- **Data Export**: Export data as CSV format
- **Statistics**: Retrieve aggregate data

## Features

### 1. **Comprehensive Data Entry**
Users can input:
- **Basic Information**:
  - Planet Name (required)
  - Detection Status: Confirmed/Candidate/False Positive (required)
  - Discovery Year
  - Discovery Method

- **Orbital Parameters**:
  - Orbital Period (required, in days)
  - Transit Duration (hours)
  - Distance from Star (AU)

- **Physical Properties**:
  - Planetary Radius (required, in Earth radii)
  - Planet Mass (Earth masses)
  - Stellar Radius (Solar radii)

- **Environmental Parameters**:
  - Equilibrium Temperature (Kelvin)
  - Insolation Flux (relative to Earth)

- **Additional Notes**: Free-text field for observations

### 2. **User-Friendly Interface**
- **Tooltips**: Every field has an info icon with detailed explanations
- **Visual Feedback**: Color-coded status badges
- **Form Validation**: Real-time validation with clear error messages
- **Progressive Disclosure**: Sections organized by parameter type
- **Clear Labels**: Non-technical language where possible

### 3. **Data Persistence**
- **Dual Storage**: Attempts API first, falls back to localStorage
- **Auto-backup**: All submitted data saved locally
- **Data Export**: Export collected data as CSV

### 4. **3D Space Background**
- **Realistic Moon**: Rotating moon with proper texturing
- **Distant Planets**: Multiple planets with distortion effects
- **Asteroid Field**: Animated asteroid belt
- **Nebula Effects**: Fog and lighting for depth
- **Smooth Animations**: All elements slowly animate

## Usage

### Accessing the Data Entry Page
Click the **"Add Exoplanet Data"** button in the top-right corner of any view.

### Filling the Form
1. Enter the planet name (required)
2. Select the detection status (required)
3. Enter orbital period and planetary radius (required)
4. Fill in optional fields as available
5. Add any additional notes
6. Click **"Save Exoplanet Data"**

### Form Validation
- Required fields are marked with *
- Invalid entries show red borders
- Error messages appear below fields
- Form won't submit until all required fields are valid

### Tooltips
Hover over the info (ℹ) icon next to any field label to see:
- What the field means
- Expected units
- Example values
- Scientific context

## Integration with AI/ML

### Data Format
The system automatically formats data for ML models:
```typescript
{
  orbital_period: number,
  transit_duration: number,
  planetary_radius: number,
  stellar_radius: number,
  equilibrium_temperature: number,
  insolation_flux: number,
  distance_from_star: number,
  planet_mass: number
}
```

### Training Integration
- Data is validated before submission
- Formatted automatically for model input
- Can be batch-exported for training
- Supports real-time classification

## API Endpoints

### Expected Backend Structure
```
POST   /api/exoplanets              - Create new exoplanet
GET    /api/exoplanets              - Get all exoplanets
GET    /api/exoplanets/:id          - Get specific exoplanet
PUT    /api/exoplanets/:id          - Update exoplanet
DELETE /api/exoplanets/:id          - Delete exoplanet
POST   /api/ml/train                - Submit for ML training
GET    /api/statistics              - Get aggregate statistics
```

### Fallback Behavior
If API is unavailable:
- Data saves to browser localStorage
- Full CRUD operations work offline
- Data persists across sessions
- Can be exported later

## Data Validation Rules

### Required Fields
- Planet Name: Non-empty string
- Orbital Period: > 0 days
- Planetary Radius: > 0 Earth radii
- Detection Status: One of the three options

### Range Validations
- Orbital Period: < 100,000 days
- Planetary Radius: < 100 Earth radii
- Temperature: 0 - 10,000 K
- Discovery Year: 1992 - present

## File Structure
```
src/
├── components/
│   ├── ExoplanetDataEntry.tsx       # Main form component (View)
│   ├── SpaceBackground3D.tsx        # 3D space scene
│   └── ui/                          # Shadcn UI components
├── models/
│   └── ExoplanetModel.ts            # Data model and validation (Model)
├── controllers/
│   └── ExoplanetController.ts       # API and business logic (Controller)
├── pages/
│   └── ExoplanetPage.tsx            # Page wrapper
└── hooks/
    └── use-toast.ts                 # Toast notifications
```

## Technologies Used
- **React**: UI framework
- **TypeScript**: Type safety
- **Three.js / React Three Fiber**: 3D graphics
- **Framer Motion**: Animations
- **Shadcn/UI**: Component library
- **Tailwind CSS**: Styling
- **Lucide React**: Icons

## Future Enhancements
- [ ] Import data from CSV/JSON
- [ ] Bulk data entry
- [ ] Data visualization charts
- [ ] Advanced search and filtering
- [ ] Export to various formats
- [ ] Integration with NASA Exoplanet Archive
- [ ] Real-time AI classification preview
- [ ] Collaborative features

## Contributing
When adding new fields:
1. Update `ExoplanetFormData` interface
2. Add validation in `ExoplanetModel.validate()`
3. Add input field in `ExoplanetDataEntry.tsx`
4. Include tooltip documentation
5. Update ML format if needed

## Notes
- All measurements use standard astronomical units
- Earth is the reference point (1.0) for most parameters
- Data follows NASA Exoplanet Archive conventions
- LocalStorage has ~5-10MB limit per domain
