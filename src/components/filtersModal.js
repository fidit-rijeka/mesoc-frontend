import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { FormGroup, Label } from "reactstrap";
import { Modal } from "reactstrap";
import Select from 'react-select'
import axios from 'axios'

let locTimeout = null;

const FiltersModal = forwardRef(({ userToken, modalOpen, setModalOpen, docsData, setDocsData, allData, filtersTemp, setFiltersTemp }, ref) => {
  const [filters, setFilters] = useState(
    filtersTemp || {
    language_id: [],
    location_id: []
  })

  const [langPicked, setLangPicked] = useState([])
  const [locPicked, setLocPicked] = useState([])

  const [langOptions, setLangOptions] = useState([]);
  const [locOptions, setLocOptions] = useState([]);
  const [locLoading, setLocLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    reset() {
      setLangPicked([])
      setLocPicked([])

      setFilters({
        language_id: [],
        location_id: []
      })
    },
  }));

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_DOMAIN}/languages`, {headers: {
        Authorization: `Bearer ${userToken}`
      }})
      .then(async res => {
        let langsToAdd = [];
        await res.data.forEach(lang => {
          langsToAdd.push({ label: lang.name, value: lang.url });
        });
        setLangOptions(langsToAdd);
      });
  }, []);

  const reset = () => {
    console.log("Oh hi there!")
  }

  const locSearch = parameter => {
    if(parameter === '') {
      setLocLoading(false);
      setLocOptions([]);
      clearTimeout(locTimeout);
      return;
    }

    setLocLoading(true);
    // Cancel any previous search attempts.
    clearTimeout(locTimeout);

    // Wait .6 seconds before starting a search
    locTimeout = setTimeout(() => {
      if(locSearch !== null) {
        axios
        .get(`${process.env.REACT_APP_API_DOMAIN}/locations?address=${parameter}`, {headers: {
          Authorization: `Bearer ${userToken}`
        }})
        .then(async res => {
          let locsToAdd = [];
          await res.data.forEach(loc => {
            locsToAdd.push({ label: loc.address, value: loc.location_id });
          });
          setLocOptions(locsToAdd);
          setLocLoading(false);
        });
      }
    }, 600);
  };

  const selectHandler = (e, col, key) => {
    if (col === 'language_id') {
      setLangPicked(e)
    }

    if (col === 'location_id') {
      setLocPicked(e)
    }

    const updated = {
      ...filters,
      [col]: e?.map(e => e[key]) || []
    }

    setFilters(updated)
    setFiltersTemp(updated)
  }

  const cancel = () => {
    setModalOpen(false)
  }

  const apply = () => {
    const query = buildFilters()
    const result = filterData(allData, query)
    setDocsData(result)
    setModalOpen(false)
  }

  const buildFilters = () => {
    const query = {}

    for (const keys in filters) {
      if (filters[keys].constructor === Array && filters[keys].length > 0) {
        query[keys] = filters[keys]
      }

      if (filters[keys].constructor === Number) {
        query[keys] = filters[keys]
      }
    }

    return query
  }

  const filterData = (data, query) => {
    const filteredData = data.filter((item) => {
      for (const key in query) {
        if (
          item[key] === undefined ||
          !query[key].some((r) => item[key].includes(r))
        ) {
          return false
        }
      }

      return true
    })

    return filteredData
  }

  return(
    <Modal
      isOpen={modalOpen}
      centered
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">Filter results</h5>
      </div>
      <div className="modal-body">
        <FormGroup className="ajax-select select2-container formField">
          <Label>Language</Label>
          <Select
            name="language"
            value={langPicked}
            onChange={event => selectHandler(event, 'language_id', 'label')}
            options={langOptions}
            isMulti
          />
        </FormGroup>

        <FormGroup className="ajax-select select2-container formField">
          <Label>Location</Label>
          <Select
            name="location"
            value={locPicked}
            onInputChange={event => locSearch(event)}
            onChange={event => selectHandler(event, 'location_id', 'label')}
            options={locOptions}
            isLoading={locLoading}
            isMulti
          />
        </FormGroup>
      </div>
      <div className="modal-footer">
        <button onClick={cancel} className="btn btn-secondary wawes-effect">
          Cancel
        </button>

        <button onClick={apply} className="btn btn-primary wawes-effect ml-3">
          Apply Filters
        </button>
      </div>
    </Modal>
  );
});

export default FiltersModal;