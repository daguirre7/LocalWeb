import React, { useState, useEffect } from 'react';
import './PaginaPrincipal.css';

export default function PaginaPrincipal() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedURL, setSelectedURL] = useState(null);
  const [selectedName, setSelectedName] = useState('FicoWaze');
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState({});

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/menuData.json`)
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(error => console.error('Error cargando el menú:', error));
  }, []);

  const handleSelection = (name, url) => {
    const hasParams = url.includes('?');
    const hasEmbed = url.toLowerCase().includes('rs:embed=true');
    const finalUrl = hasEmbed ? url : url + (hasParams ? '&' : '?') + 'rs:Embed=true';
    setSelectedName(name);
    setSelectedURL(finalUrl);
    /*setIsMenuOpen(false)*/; //cierra el menu al hacer click
  };
  const goHome = () => {
    window.location.href = '/ficowaze';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleSubMenu = (key) => {
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderMenuItems = (items, parentKey = '') => {
    return (
      <ul className="submenu-vertical">
        {items.map((item, index) => {
          const currentKey = `${parentKey}-${item.name}-${index}`;
          const isOpen = openMenus[currentKey];

          if (item.children || item.sub) {
            return (
              <li key={currentKey} className={`sub-dropdown ${isOpen ? 'open' : ''}`}>
                <button className="dropdown-btn" onClick={() => toggleSubMenu(currentKey)}>
                  {item.name} <i className="fas fa-caret-right"></i>
                </button>
                {isOpen && renderMenuItems(item.children || item.sub, currentKey)}
              </li>
            );
          } else if (item.url) {
            return (
              <li key={currentKey}>
                <button onClick={() => handleSelection(item.name, item.url)}>
                  {item.name}
                </button>
              </li>
            );
          } else {
            return null;
          }
        })}
      </ul>
    );
  };

  return (
    <div className="pagina-principal">
      <header>
        <div className="navbar">
          <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt="Home" className="home-icon-img" />
            
          </div>
          <div className="navbar-name">
            <i className="fas fa-house"></i> FICOWAZE
          </div>
          <div className="navbar-center">
            <button onClick={goHome} className="home-icon-button">
              <button onClick={goHome} className="home-icon-button">
                   <img src={`${process.env.PUBLIC_URL}/home.png`} alt="Home" className="home-icon-img" />
              </button>
            </button>   
          </div>
          <button onClick={toggleMenu} className="menu-button">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className="container">
        <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
          <ul className="menu-lateral">
            {menuItems.map((item, index) => {
              const key = `root-${item.name}-${index}`;
              const isOpen = openMenus[key];

              return (
                <li key={key} className={`dropdown ${isOpen ? 'open' : ''}`}>
                  <button className="dropdown-btn" onClick={() => toggleSubMenu(key)}>
                    {item.icon && (
                      <img
                        src={process.env.PUBLIC_URL + item.icon}
                        alt={item.name}
                        className="menu-icon"
                      />
                    )}
                    {item.name}
                    <i className="fas fa-caret-down"></i>
                  </button>

                  {isOpen && item.sub && renderMenuItems(item.sub, key)}
                </li>
              );
            })}
          </ul>
        </aside>

        <main>
          <h2 className='main-title'>{selectedName}</h2>
          {selectedURL ? (
            <iframe
              src={selectedURL}
              title={selectedName}
              style={{ width: '100%', height: '92vh', border: 'none' }}
            />
          ) : (
            <>
              <p>Selecciona un subsegmento para ver el contenido embebido.</p>
              <p>...</p>
            </>
          )
          }
        </main>
      </div>

      <footer>
        <p>2025 Data Science Riesgos</p>
      </footer>
    </div>
  );
}
