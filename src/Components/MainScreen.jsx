import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { useMediaQuery } from "react-responsive";
import InteractiveMap from "./InteractiveMap";
import "./MainScreen.css";

function MainScreen() {
  const [searchType, setSearchType] = useState("Nume");
  const [searchQuery, setSearchQuery] = useState("");
  const [countiesData, setCountiesData] = useState({});
  const [selectedCounty, setSelectedCounty] = useState(null);

  const isTabletOrDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  const listOfCounties = [
    "Alba",
    "Arad",
    "Arges",
    "Bacau",
    "Bihor",
    "Bistrita Nasaud",
    "Botosani",
    "Braila",
    "Brasov",
    "Bucuresti",
    "Buzau",
    "Calarasi",
    "Caras Severin",
    "Cluj",
    "Constanta",
    "Covasna",
    "Dambovita",
    "Dolj",
    "Galati",
    "Giurgiu",
    "Gorj",
    "Harghita",
    "Hunedoara",
    "Ialomita",
    "Iasi",
    "Maramures",
    "Mehedinti",
    "Mures",
    "Neamt",
    "Olt",
    "Prahova",
    "Salaj",
    "Satu Mare",
    "Sibiu",
    "Suceava",
    "Teleorman",
    "Timis",
    "Tulcea",
    "Vaslui",
    "Valcea",
    "Vrancea",
  ];

  useEffect(() => {
    fetch(window.location.pathname + "countiesData.csv")
      .then((response) => response.text())
      .then((data) => {
        const parsedData = parseCSV(data);
        setCountiesData(parsedData);
      })
      .catch((error) =>
        console.error("Eroare la încărcarea fișierului CSV:", error)
      );
  }, []);

  const parseCSV = (csvText) => {
    const lines = csvText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const counties = {};
    let currentCounty = null;

    for (let i = 0; i < lines.length; i++) {
      const columns = lines[i].split(",");

      if (columns[0] === "Judet") {
        currentCounty = columns[1].trim();
        counties[currentCounty] = [];
        i++; // Sărim peste header-ul "Nume, Prenume, Telefon, Data nasterii, Fotografie"
      } else if (currentCounty) {
        counties[currentCounty].push({
          nume: columns[0].trim(),
          prenume: columns[1].trim(),
          telefon: columns[2].trim(),
          dataNasterii: columns[3].trim(),
          fotografie: columns[4].trim(), // Adăugăm URL-ul imaginii
        });
      }
    }

    return counties;
  };

  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  function handleSearch() {
    // console.log("Tip căutare:", searchType);
    // console.log("Căutare pentru:", searchQuery);

    if (!searchQuery.trim()) {
      // **********************************************
      // to do: insert an alert
      // **********************************************
      console.log("Introduceți un text pentru căutare.");
      return;
    }

    let filteredResults = [];

    Object.keys(countiesData).forEach((county) => {
      countiesData[county].forEach((person) => {
        if (
          (searchType === "Nume" &&
            (person.nume.toLowerCase().includes(searchQuery.toLowerCase()) ||
              person.prenume
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))) ||
          (searchType === "Numar" && person.telefon.includes(searchQuery))
        ) {
          filteredResults.push({ ...person, judet: county });
        }
      });
    });

    setSelectedCounty({ name: "Rezultatele căutării", data: filteredResults });
    setSearchQuery("");
  }

  const handleCountySelection = (countyName) => {
    if (countiesData[countyName]) {
      setSelectedCounty({
        name: `Datele pentru județul ${countyName}`,
        data: countiesData[countyName],
      });
    } else {
      // *******************************
      // TO DO: insert an alert
      // *******************************
      console.log("Nu s-au găsit date pentru județul selectat.");
      setSelectedCounty(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [month, day, year] = dateString.split("/");
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <div className="search-bar">
        <a href="/simple-menu/">&nbsp;&nbsp; H O M E &nbsp;&nbsp;</a>
        <div className="search-params">
          <FormControl>
            <RadioGroup row value={searchType} onChange={handleChange}>
              <FormControlLabel
                value="Nume"
                control={
                  <Radio sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }} />
                }
                label="Nume"
                sx={{ "& .MuiTypography-root": { fontSize: "20px" } }}
              />
              <FormControlLabel
                value="Numar"
                control={
                  <Radio sx={{ "& .MuiSvgIcon-root": { fontSize: 30 } }} />
                }
                label="Nr.telefon"
                sx={{ "& .MuiTypography-root": { fontSize: "20px" } }}
              />
            </RadioGroup>
          </FormControl>
          <div className="search-text">
            <input
              type="text"
              placeholder="Introduceti textul"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="searchButton"
              onClick={handleSearch}
            >
              Caută
            </button>
          </div>
        </div>
      </div>

      {!selectedCounty && isTabletOrDesktop && (
        <InteractiveMap onAreaClick={handleCountySelection} />
      )}

      {!selectedCounty && !isTabletOrDesktop && (
        <div className="list">
          {listOfCounties.map((county, index) => (
            <div
              key={index}
              className="county-item"
              onClick={() => handleCountySelection(county)}
              style={{
                cursor: "pointer",
                padding: "4px",
              }}
            >
              {county}
            </div>
          ))}
        </div>
      )}
      {/* TABELUL - apare doar dacă există date */}
      {selectedCounty && (
        <div className="data-table">
          <h2>{selectedCounty.name}</h2>

          {isTabletOrDesktop ? (
            // Varianta tabelară pentru desktop
            <table>
              <thead>
                <tr>
                  <th>Nume</th>
                  <th>Prenume</th>
                  <th>Telefon</th>
                  <th>Data nașterii</th>
                  <th>Fotografie</th>
                </tr>
              </thead>
              <tbody>
                {selectedCounty.data.map((person, index) => (
                  <tr key={index}>
                    <td>{person.nume}</td>
                    <td>{person.prenume}</td>
                    <td>{person.telefon}</td>
                    <td>{formatDate(person.dataNasterii)}</td>
                    <td>
                      <img
                        src={person.fotografie}
                        alt={`${person.nume} ${person.prenume}`}
                        width="150"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Varianta cu carduri pentru mobil
            <div className="cards-container">
              {selectedCounty.data.map((person, index) => (
                <div className="person-card" key={index}>
                  <img
                    src={person.fotografie}
                    alt={`${person.nume} ${person.prenume}`}
                    className="person-photo"
                  />
                  <div className="person-details">
                    <p className="person-name">
                      {person.nume} {person.prenume}
                    </p>
                    <p>Data nașterii: {formatDate(person.dataNasterii)}</p>
                    <p>📞 {person.telefon}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setSelectedCounty(null)}
            className="back-button"
          >
            Înapoi la {isTabletOrDesktop ? `hartă` : `listă`}
          </button>
        </div>
      )}
    </div>
  );
}

export default MainScreen;
