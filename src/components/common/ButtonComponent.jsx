import { Button } from 'primereact/button';

const ButtonComponent = ({
    label,
    type,
    onClick,
    disabled,
    icon,
    className,
    tooltip,
    loading,
    iconPos
}) => (
    <div className='custom-button-design'>
        <Button
            label={label}
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
            icon={icon}
            tooltip={tooltip}
            loading={loading}
            iconPos={iconPos}
        />
    </div>
);

export default ButtonComponent;