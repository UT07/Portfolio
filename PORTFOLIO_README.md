# Utkarsh Singh / UT — Dual-Mode Portfolio

A single-page, endless-scroll personal website with a **dual-persona toggle switch** that seamlessly transitions between two distinct identities:

- **MODE A: Professional (Tech)** — Apple-clean aesthetic showcasing Cloud + Systems Engineering expertise with MLOps focus
- **MODE B: DJ** — Dark rave / neopunk futuristic theme highlighting UT's high-energy club music and DJ career

## 🌟 Features

### Core Functionality
- **Dual Mode Toggle**: Smooth theme switching between Professional and DJ modes
- **localStorage Persistence**: Your mode selection is remembered across sessions
- **Hash Routing**: Shareable links with `#tech` or `#dj` anchors
- **Sticky Navigation**: Fixed header with smooth scroll navigation
- **Endless Scroll**: Single-page layout with all sections on one page
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### Professional Mode
- **Hero**: Cloud Engineer headline with CTAs
- **Highlights**: 6 key achievements with icons
- **About**: Professional narrative
- **Education**: In-depth academic background with expandable coursework, projects, and leadership roles
- **Experience**: Professional timeline with detailed achievements
- **Projects**: Featured case studies + GitHub repository showcase
- **Skills**: Categorized technical expertise (AWS, DevOps, MLOps, etc.)
- **Certifications**: AWS credentials
- **Contact**: Professional contact form with GitHub/LinkedIn

### DJ Mode
- **Hero**: High-energy headline with genre tags
- **Artist**: Bio and performance style
- **Gig Timeline**: Interactive timeline with sort/filter by genre/collective
- **Press Kit**: Public downloads (bio, photos, logo, tech rider)
- **Contact**: Booking form with SoundCloud/YouTube links

## 🎨 Design System

### Professional Mode
- **Colors**: White background, black text, subtle blue accents
- **Typography**: Plus Jakarta Sans (headings), Inter (body)
- **Style**: Minimal, precision, high contrast, generous whitespace

### DJ Mode
- **Colors**: Black background, white/cyan/fuchsia neon accents
- **Typography**: Unbounded (headings), Space Mono (body)
- **Style**: Industrial, energetic, neon glow effects

## 🚀 Tech Stack

- **Frontend**: React 19 + Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data**: JSON files for easy content updates

## 🔧 Development

### Installation
```bash
cd /app/frontend
yarn install
```

### Start Development Server
```bash
yarn start
```

The app will run on `http://localhost:3000`

### Build for Production
```bash
yarn build
```

## 📝 Content Management

All content is stored in JSON files for easy updates:

- `/app/frontend/src/data/professionalData.json` - Professional content
- `/app/frontend/src/data/projectsData.json` - Projects & GitHub repos
- `/app/frontend/src/data/djData.json` - DJ content & gigs

## 🎯 Adding New Gigs

To add a new gig, append to the `gigs` array in `djData.json`:

```json
{
  "id": "gig-16",
  "event": "Event Name",
  "collective": "Collective Name",
  "date": "2026-02-15",
  "location": "Venue, Dublin, Ireland",
  "time": "11:00 PM – 12:00 AM",
  "genre": ["Hard Dance", "Trance"],
  "tags": ["SOLD OUT"],
  "description": "Event description",
  "clips": []
}
```

## 📧 Contact

**Email**: 254utkarsh@gmail.com

---

**Made with Emergent**
