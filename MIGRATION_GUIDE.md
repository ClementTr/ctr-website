# Guide de migration

## Migration vers React 18

### 1. Mettre à jour les dépendances

```bash
npm install react@^18.2.0 react-dom@^18.2.0
```

### 2. Modifier `src/index.js`

**Avant (React 16/17):**
```javascript
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));
```

**Après (React 18):**
```javascript
import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

## Migration vers React Router v6

### 1. Mettre à jour la dépendance

```bash
npm install react-router-dom@^6.20.0
```

### 2. Modifier `src/App.js`

**Avant (v5):**
```javascript
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

<Router>
  <Switch>
    <Route exact path='/' component={HomeComponent} />
    <Route exact path='/ctr-map' component={JourneyComponent} />
    <Route exact path='/about' component={AboutComponent} />
    <Route component={NotFoundComponent} />
  </Switch>
</Router>
```

**Après (v6):**
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<Router>
  <Routes>
    <Route path='/' element={<HomeComponent />} />
    <Route path='/ctr-map' element={<JourneyComponent />} />
    <Route path='/about' element={<AboutComponent />} />
    <Route path='*' element={<NotFoundComponent />} />
  </Routes>
</Router>
```

**Changements principaux:**
- `Switch` → `Routes`
- `component={Component}` → `element={<Component />}`
- `exact` n'est plus nécessaire (par défaut dans v6)
- Route 404 : `path='*'` au lieu de `component={NotFoundComponent}` sans path

## Migration vers les Hooks

### Convertir `App.js` de classe vers fonction

**Avant:**
```javascript
class App extends Component {
  render() {
    return (
      <Router>
        {/* ... */}
      </Router>
    );
  }
}
```

**Après:**
```javascript
function App() {
  return (
    <Router>
      {/* ... */}
    </Router>
  );
}
```

## Remplacer les console.log

### Utiliser le logger utilitaire

**Avant:**
```javascript
console.log(purpose);
console.log(purpose_countries);
```

**Après:**
```javascript
import logger from '../utils/logger';

logger.log(purpose);
logger.log(purpose_countries);
```

## Améliorer l'accessibilité

### Remplacer les attributs HTML obsolètes

**Avant (`HeaderComponent.js`):**
```javascript
<hr className="vectline" align="center" width="90%" size="3"/>
```

**Après:**
```javascript
<hr 
  className="vectline" 
  style={{ 
    width: '90%', 
    height: '3px',
    margin: '0 auto'
  }}
  role="separator"
/>
```

## Code Splitting avec React.lazy

### Ajouter le lazy loading des routes

**Modifier `src/App.js`:**
```javascript
import { lazy, Suspense } from 'react';

const HomeComponent = lazy(() => import('./Components/Home/HomeComponent'));
const JourneyComponent = lazy(() => import('./Components/Map/JourneyComponent'));
const AboutComponent = lazy(() => import('./Components/About/AboutComponent'));
const NotFoundComponent = lazy(() => import('./Components/NotFoundComponent'));

function App() {
  return (
    <Router>
      <div>
        <HeaderComponent/>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<HomeComponent />} />
            <Route path='/ctr-map' element={<JourneyComponent />} />
            <Route path='/about' element={<AboutComponent />} />
            <Route path='*' element={<NotFoundComponent />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}
```
