import React, { useState, useEffect} from 'react';
import './PaginaPrincipal.css';

export default function PaginaPrincipal() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedURL, setSelectedURL] = useState(null);
  const [selectedName, setSelectedName] = useState('FicoInsight');
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
    window.location.href = '/ficoinsight';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleSubMenu = (key,parentKey)=>{
    setOpenMenus(prev =>{
      const newState = Object.keys(prev).reduce((acc,k) => {
        const isSibling = k.startsWith(parentKey) && k !== key && k.split('-').length=== key.split('-').length;
        if (!isSibling) acc[k]=prev[k];
        return acc;
      },{});
      return{
        ...newState,
        [key]: !prev[key]
      };
    });
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
                <button className="dropdown-btn" onClick={() => toggleSubMenu(currentKey,parentKey)}>
                {/* <button className="dropdown-btn" onClick={() => toggleSubMenu(currentKey)}> */}
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
      <header >
        <div className="navbar">
          <div className="logo">
            <img src={`${process.env.PUBLIC_URL}/IconoFicohsaNav.png`} alt="Home" className="home-icon-img" />
          </div>
          <div className="navbar-name">
            <i className="fas fa-house"></i> FICOINSIGHT
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
                  {/* <button className="dropdown-btn" onClick={() => toggleSubMenu(key)}> */}
                  <button className="dropdown-btn" onClick={() => toggleSubMenu(key,'root')}>
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
          <div className="sidebar-footer">        
          <img
            src={`${process.env.PUBLIC_URL}/images/p_logoDS1.png`}
            alt="img"
            className="sidebar-logo-icon"
            />  
            <button className="enlace-tablero"
              onClick={()=>handleSelection("Estadisticas Server","http://hnsvrblazeapp1:5853/ReportsDS/powerbi/Honduras/Consultas%20a%20Tableros%20PBIRS")}>
              Visitas a FicoInsight
            </button>
            <p className="footer-sidebar-name">__</p>        
          </div>
        </aside>
        <main >
          {selectedURL ? (
            <>
            <iframe 
              src={`${selectedURL}${selectedURL.includes('?') ? '&' : '?'}rs:Embed=true`}
              title={selectedName}
              style={{ width: '100%', height: '100%', border: 'none'}}
            />
            </>
          ) : (
            <>
              <h2 className='main-title'>{selectedName}</h2>
              <p className="parrafo1">FicoInsight nace con la visión de convertirse en el repositorio único de tableros de Power BI para la toma de decisiones en materia de riesgos, facilitando la trazabilidad, el análisis comparativo entre bancas, y promoviendo una cultura de datos accesibles y útil para todos los equipos de riesgo.

              </p>
              <p></p>
                <div className="div-imagen-fondo">
                  <img src={`${process.env.PUBLIC_URL}/logo_ficoinsight.png`}
                  alt="Fondo" 
                  className="imagen-fondo"
                  />
                </div>
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
