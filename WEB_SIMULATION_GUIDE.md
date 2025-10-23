# ChemPath Web Simulation Interface

## 🌐 Overview

This is the **web-based simulation interface** for ChemPath. Instead of running in your IDE terminal, the simulation runs in your web browser with a professional, interactive interface.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Web Server

```bash
python app.py
```

### 3. Open in Browser

Navigate to: **http://localhost:5000**

The web interface will automatically open and you can:
- View the landing page with all features
- Click "Start Simulation" to run the ChemPath pipeline
- Watch real-time progress with visual indicators
- See beautifully formatted results

## 📊 Features

### Landing Page (`/`)
- **Performance Metrics**: Speed improvement, accuracy enhancement, deployment flexibility
- **Feature Highlights**: Classical modeling, cultural-aware AI, synthesis optimization, EquiPath compensation
- **Simulation Info**: Case study details, processing capacity, expected runtime
- **Start Button**: Launch the simulation with one click

### Simulation Page (`/run-simulation`)
- **Real-time Progress Bar**: Visual progress from 0-100%
- **Current Step Display**: Shows exactly what's happening
- **Stage Indicators**: 6 stages with checkmarks as they complete
- **Live Updates**: Auto-refreshes every 500ms
- **Error Handling**: Displays any errors that occur

### Results Page (`/results`)
- **Performance Metrics Cards**: Speed, accuracy, deployment, capacity
- **Compound Analysis**: Detailed results for all 3 compounds
  - QSAR scores
  - Binding affinity
  - Bioavailability improvements
  - Synthesis pathways
  - Safety enhancements
- **EquiPath Compensation Summary**: Total compensation distributed
- **Key Findings**: 4 major insights from the simulation
- **Action Buttons**: Download report, run new simulation, share results

## 🎨 Professional Design

- **Modern UI**: Clean, professional interface
- **Gradient Backgrounds**: Eye-catching colors
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Progress bars, hover effects, transitions
- **Color-Coded Metrics**: Green for success, blue for info, yellow for highlights

## 🔧 Technical Details

### Backend (Flask)
- **app.py**: Main Flask application
- **API Endpoints**:
  - `POST /api/start-simulation`: Start the simulation
  - `GET /api/simulation-status`: Get current progress
- **Background Processing**: Simulation runs in separate thread
- **Status Tracking**: Global state management

### Frontend (HTML/CSS/JS)
- **templates/**: HTML templates
  - `index.html`: Landing page
  - `simulation.html`: Progress page
  - `results.html`: Results display
- **static/css/**: Stylesheets
  - `style.css`: All styles with modern design
- **JavaScript**: Vanilla JS for AJAX calls and updates

## 📱 Screenshots

### Landing Page
- Hero section with stats
- Feature cards
- Simulation information
- Technology stack

### Simulation Running
- Progress bar (0-100%)
- Current step text
- 6 stage indicators
- Information box

### Results Display
- Metrics grid
- 3 compound cards
- Compensation summary
- Key findings
- Action buttons

## 🛠️ Customization

### Change Colors
Edit `static/css/style.css`:
```css
:root {
    --primary-color: #2563eb;  /* Change to your color */
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
}
```

### Modify Simulation Steps
Edit `app.py` in the `run_chempath_simulation()` function to add/remove steps.

### Add New Pages
1. Create HTML template in `templates/`
2. Add route in `app.py`
3. Link from existing pages

## 🔒 Security Notes

- This is a **local development server**
- Not intended for production deployment
- Runs on localhost only by default
- No authentication/authorization implemented

## 📦 Deployment (Optional)

For production deployment, consider:
1. Use a production WSGI server (Gunicorn, uWSGI)
2. Add SSL/TLS certificates
3. Implement authentication
4. Use environment variables for configuration
5. Add rate limiting

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in app.py
app.run(debug=True, host='0.0.0.0', port=8080)
```

### Simulation Not Starting
- Check browser console for JavaScript errors
- Verify Flask server is running
- Check network tab in browser dev tools

### Results Not Displaying
- Ensure simulation completed successfully
- Check `/api/simulation-status` endpoint
- Verify results are stored in global state

## 🎯 Next Steps

1. Run the simulation and watch it work!
2. Explore the results page
3. Try running multiple simulations
4. Customize the styling to your preference
5. Add more features as needed

## 💡 Tips

- Keep the browser console open to see AJAX calls
- Refresh the page if something seems stuck
- The simulation takes ~30-60 seconds to complete
- You can run multiple simulations back-to-back
- Results are stored in memory (cleared on server restart)

---

**Enjoy your professional web-based ChemPath simulation!** 🚀🧬
