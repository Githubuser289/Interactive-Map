import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InteractiveMap from "./InteractiveMap";
import "./MainScreen.css";

function MainScreen() {
  const [searchType, setSearchType] = useState("Nume");
  const [searchQuery, setSearchQuery] = useState("");
  const [countiesData, setCountiesData] = useState({});
  const [selectedCounty, setSelectedCounty] = useState(null);

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
    console.log("Tip căutare:", searchType);
    console.log("Căutare pentru:", searchQuery);

    if (!searchQuery.trim()) {
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

  const handleAreaClick = (areaName) => {
    if (countiesData[areaName]) {
      console.log("Datele pentru", areaName, ":", countiesData[areaName]);
      setSelectedCounty({
        name: `Datele pentru județul ` + areaName,
        data: countiesData[areaName],
      });
    } else {
      console.log("Nu s-au găsit date pentru județul selectat.");
      setSelectedCounty(null);
    }
  };

  return (
    <div>
      <div className="search-bar">
        <a href="../../index.html">&nbsp;&nbsp; H O M E &nbsp;&nbsp;</a>
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
                label="Numar"
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

      {!selectedCounty && <InteractiveMap onAreaClick={handleAreaClick} />}

      {/* TABELUL - apare doar dacă există date */}
      {selectedCounty && (
        <div className="data-table">
          <h2>{selectedCounty.name}</h2>
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
                  <td>{person.dataNasterii}</td>
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
          <button
            onClick={() => setSelectedCounty(null)}
            className="back-button"
          >
            Înapoi la hartă
          </button>
        </div>
      )}
    </div>
  );
}

export default MainScreen;
