import React, { useState, useEffect } from 'react';
import './PaginaPrincipal.css';

export default function PaginaPrincipal() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedURL, setSelectedURL] = useState(null);
  const [selectedName, setSelectedName] = useState('Bienvenido');

  useEffect(() => {
    fetch('/menuData.json')
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

  return (
    <div className="pagina-principal">
      <header>
        <div className="navbar">
          <div className="logo">
            <i className="fas fa-house"></i> FICOWAZE
          </div>
          <ul className="menu-horizontal">
            {menuItems.map((item, index) => (
              <li key={index} className="dropdown">
                <button className="dropdown-btn">
                  {item.name} <i className="fas fa-caret-down"></i>
                </button>
                <ul className="submenu-horizontal">
                  {item.sub.map((subItem, subIndex) => (
                    <li key={subIndex} className={subItem.children ? 'sub-dropdown' : ''}>
                      {subItem.children ? (
                        <>
                          <button className="dropdown-btn">
                            {subItem.name} <i className="fas fa-caret-right"></i>
                          </button>
                          <ul className="submenu-vertical">
                            {subItem.children.map((child, cIndex) => (
                              <li key={cIndex}>
                                <button
                                  onClick={() => handleSelection(child.name, child.url)}
                                >
                                  {child.name}
                                </button>
                              </li>
                            ))}
                          </ul>
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
        <p>© 2025 Data Science Riesgos</p>
      </footer>
    </div>
  );
}
