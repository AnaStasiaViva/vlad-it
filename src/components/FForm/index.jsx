import React, { useState, useEffect, useCallback } from "react";
import { scriptRequest } from "../../utils/jsonp";
import { capitalizeFirstLetter, deeplyNested } from "./../../utils/hepler";
import "./style.scss";
import Loader from "../Loader";

const FForm = () => {
  const [state, setState] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const sendRequest = useCallback((query) => {
    if (!query) return;
    setLoading(true);
    scriptRequest(
      `https://kladr-api.ru/api.php?query=${query}&contentType=city`,
      function (res) {
        // sorting by city

        const sortedCities = res?.result?.filter(
          (item) => item.type === "Город"
        );

        //making uppercase the keys with sorted by type val
        const upperCaseKeys = deeplyNested(sortedCities);
        console.log(upperCaseKeys, "UPPERCASE OBJ KEYS===>>>");

        setState([...sortedCities]);
        setLoading(false);
      },
      function (err) {
        console.log("ERROR", err);
      }
    );
  }, []);

  const capitalizeFirstLetterHandler = (e) => {
    const capitalized = capitalizeFirstLetter(e.target.value);
    setQuery(capitalized);
  };

  useEffect(() => {
    if (!query) return null;

    const time = setTimeout(() => {
      sendRequest(query);
    }, 1000);

    return () => {
      clearTimeout(time);
    };
  }, [query, sendRequest]);

  return (
    <div className="FForm">
      {loading && <Loader />}
      <form>
        <input
          autocomplete="off"
          list="cities"
          placeholder="Выберите Город"
          name="cities"
          id="browser"
          value={query}
          onChange={(e) => capitalizeFirstLetterHandler(e)}
        />
        <datalist id="cities">
          {state?.map((item) => (
            <option key={item.id} value={item.name} />
          ))}
        </datalist>
      </form>
    </div>
  );
};

export default FForm;
