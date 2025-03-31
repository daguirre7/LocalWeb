import React, { useState, useEffect } from 'react';
import './PaginaPrincipal.css';

export default function PaginaPrincipal() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedURL, setSelectedURL] = useState(null);
  const [selectedName, setSelectedName] = useState('Bienvenido');

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
  };

  const goHome = () => {
    window.location.href = '/ficowaze';
  };

  // Función recursiva para renderizar submenús anidados
  const renderSubMenu = (items) => {
    return (
      <ul className="submenu-vertical">
        {items.map((item, index ) => (
          <li key={index} className={item.children ? 'sub-dropdown' : ''}>
            {item.children ? (
              <>
                <button className="dropdown-btn">
                  {item.name} <i className="fas fa-caret-right"></i>
                </button>
                {renderSubMenu(item.children)}
              </>
            ) : (
              <button onClick={() => handleSelection(item.name, item.url)}>
                {item.name}
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="pagina-principal">
      <header>
        <div className="navbar">
          <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/favicon.ico`} alt="Home" className="home-icon-img" />
            <i className="fas fa-house"></i> FICOWAZE
          </div>
          <ul className="menu-horizontal">
            <li>
              <button onClick={goHome} className="home-icon-button">
                <img src={`${process.env.PUBLIC_URL}/home.png`} alt="Home" className="home-icon-img" />
              </button>
            </li>
            {menuItems.map((item, index) => (
              <li key={index} className="dropdown">
                <button className="dropdown-btn">
                  {item.icon &&(
                    <img 
                      src={process.env.PUBLIC_URL + item.icon}
                      alt={item.name}
                      className="menu-icon"
                    />
                  )}
                  {item.name} 
                  <i className="fas fa-caret-down"></i>
                </button>
                <ul className="submenu-horizontal">
                  {item.sub.map((subItem, subIndex) => (
                    <li key={subIndex} className={subItem.children ? 'sub-dropdown' : ''}>
                      {subItem.children ? (
                        <>
                          <button className="dropdown-btn">
                            {subItem.name} <i className="fas fa-caret-right"></i>
                          </button>
                          {renderSubMenu(subItem.children)}
                        </>
                      ) : (
                        <button onClick={() => handleSelection(subItem.name, subItem.url)}>
                          {subItem.name}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="container">
        <main>
          <h2>{selectedName}</h2>
          {selectedURL ? (
            <iframe
              src={`${selectedURL}${selectedURL.includes('?') ? '&' : '?'}rs:Embed=true`}
              title={selectedName}
              style={{ width: '100%', height: '92vh', border: 'none' }}
            />
          ) : (
            <p>Selecciona un subsegmento para ver el contenido embebido.</p>
          )}
        </main>
      </div>

      <footer>
        <p>2025 Data Science Riesgos</p>
      </footer>
    </div>
  )
}