// hooks
import { useState } from 'react';

// utils
import { AutoComplete } from 'primereact/autocomplete';

const AutocompleteComponent = ({value, name, label, placeholder, data, error, touched, onChange}) => {

  const [filteredData, setFilteredData] = useState(data);

  const search = (event) => {
    setTimeout(() => {
        let _filteredData;

        if (!event.query.trim().length) {
          _filteredData = [...data];
        }
        else {
          _filteredData = data.filter((data) => {
              return data.name.toLowerCase().startsWith(event.query.toLowerCase());
          });
        }
        setFilteredData(_filteredData);
    }, 250);
  }

  return (
      <div className="custom-input-design w-full">
      {label ? (
      <label className="text-[12px] text-TextSecondaryColor ms-[4px] font-[600]">{label}</label>
      ) : null}

      <AutoComplete 
        field={name}
        value={value} 
        placeholder={placeholder}
        className="autocomplete w-full"
        suggestions={filteredData} 
        completeMethod={search} 
        onChange={onChange}
      />

      {error && touched ? (
        <p className="text-[0.7rem] text-red-600">{error}</p>
      ) : (
        ""
      )}
      </div>
  )
}

export default AutocompleteComponent;