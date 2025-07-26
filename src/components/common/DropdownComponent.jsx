// utils
import { Dropdown } from 'primereact/dropdown';

const DropdownComponent = ({value, name, editable, data, onChange, disabled, optionLabel, placeholder, className, error, touched}) => {
  return (
    <div className='w-full'>
       {placeholder ? (
          <label className="text-[12px] text-TextPrimaryColor ms-[4px] font-[600]">{placeholder}</label>
        ) : null}
        <Dropdown 
            name={name}
            value={value} 
            onChange={(e) => onChange(name, e.value)} 
            options={data} 
            editable={editable}
            disabled={disabled}
            optionLabel={optionLabel}
            placeholder={placeholder}
            className={className}
         />
         {error && touched ? (
            <p className="text-[0.7rem] text-red-600">{error}</p>
          ) : (
            ""
          )}
    </div>
  )
}

export default DropdownComponent;