import starsBG from "../../assets/images/stars.png";

const MainBtn = ({
    text = "",
    disabled = false,
    className = "",
    divClass = "",
    spanClass = "",
    hasStars = true,
    noScale = false,
    onClick = () => { },
    colorScheme = "blue",
}) => {
    if (disabled) {
        colorScheme = ""
    }
    // Define color schemes
    const colorSchemes = {
        blue: {
            gradientFrom: "#1fccff",
            gradientTo: "#2D68FF",
            shadow: "#2D68FF",
            border: "#2D68FF",
            disabledBorder: "#222",
            disabledShadow: "#222",
            disabledGradient: "#303030",
            activeBorder: "#002A94",
            activeShadow: "#002A94",
            activeGradientFrom: "#0082a9",
            activeGradientTo: "#002a94",
            hoverShadow: "#1B3E99",
            innerShadow: "#1FCCFF",
        },
        red: {
            gradientFrom: "#FF4D12",
            gradientTo: "#5D0001",
            shadow: "#5D0001",
            border: "#5D0001",
            disabledBorder: "#222",
            disabledShadow: "#222",
            disabledGradient: "#303030",
            activeBorder: "#5D0001",
            activeShadow: "#b30000",
            activeGradientFrom: "#cc0000",
            activeGradientTo: "#b30000",
            hoverShadow: "#990000",
            innerShadow: "#5D0001",
        },
        green: {
            gradientFrom: "#4dff4d",
            gradientTo: "#1aff1a",
            shadow: "#1aff1a",
            border: "#1aff1a",
            disabledBorder: "#222",
            disabledShadow: "#222",
            disabledGradient: "#303030",
            activeBorder: "#00b300",
            activeShadow: "#00b300",
            activeGradientFrom: "#00cc00",
            activeGradientTo: "#00b300",
            hoverShadow: "#009900",
            innerShadow: "#4dff4d",
        },
        white: {
            gradientFrom: "#FFFFFF",
            gradientTo: "#E0E0E0",
            shadow: "#E0E0E0",
            border: "#E0E0E0",
            disabledBorder: "#222",
            disabledShadow: "#222",
            disabledGradient: "#303030",
            activeBorder: "#E0E0E0",
            activeShadow: "#E0E0E0",
            activeGradientFrom: "#E0E0E0",
            activeGradientTo: "#E0E0E0",
            hoverShadow: "#E0E0E0",
            innerShadow: "#FFFFFF",
        }
    };

    // Get the color scheme or fall back to blue if invalid
    const colors = colorSchemes[colorScheme] || colorSchemes.blue;

    // Define dynamic styles for the button
    const buttonStyle = {
        background: disabled
            ? `linear-gradient(to right, ${colors.disabledGradient}, ${colors.disabledGradient})`
            : `linear-gradient(to right, ${colors.gradientFrom}, ${colors.gradientTo})`,
        boxShadow: disabled
            ? `0 4px 0 0 ${colors.disabledShadow}`
            : `0 4px 0 0 ${colors.shadow}`,
        border: `1px solid ${disabled ? colors.disabledBorder : colors.border}`,
    };

    // Hover and active styles need to be handled via classes or additional logic,
    // but since we're moving to styles, we can keep pseudo-classes in CSS if defined elsewhere,
    // or use JS for hover if needed. For simplicity, we'll assume Tailwind handles pseudo if static.

    // For active state (requires JS or CSS)
    // Note: Active styles would need event handlers or CSS :active

    // Define dynamic styles for the span
    const spanStyle = {
        background: `linear-gradient(100deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
    };

    // Inner div shadow style
    const innerDivStyle = {
        boxShadow: `inset 0 0 20px 1px ${colors.innerShadow}`,
    };

    return (
        <div
            className={`relative group ${noScale ? "" : "scale-[0.85] sm:scale-100"} md:scale-100 ${divClass}`}
        >
            {hasStars && (
                <div className="absolute left-0 top-0 w-full h-full group-hover:opacity-100 opacity-0 trans-3 animationspacefloot select-none pointer-events-none">
                    <img
                        src={starsBG}
                        className="absolute top-1/2 -translate-y-1/2 left-1/2 w-[calc(100%+100px)] h-[calc(100%+100px)]"
                        alt="stars"
                    />
                    <img
                        src={starsBG}
                        className="absolute top-1/2 -translate-y-1/2 -left-1/2 rotate-180 w-[calc(100%+100px)] h-[calc(100%+100px)]"
                        alt="stars"
                    />
                    <img
                        src={starsBG}
                        className="absolute top-1/2 -translate-y-1/2 left-0 rotate-90 w-[calc(100%+100px)] h-[calc(100%+100px)]"
                        alt="stars"
                    />
                    <img
                        src={starsBG}
                        className="absolute top-1/2 -translate-y-1/2 left-0 rotate-45 w-[calc(100%+100px)] h-[calc(100%+100px)]"
                        alt="stars"
                    />
                </div>
            )}
            <button
                type="button"
                disabled={disabled}
                onClick={onClick}
                style={buttonStyle}
                className={`
          main-btn relative p-[2px] group rounded-[40px] xs:rounded-[50px] overflow-hidden
          disabled:animate-none disabled:cursor-default
          active:border-[${colors.activeBorder}]
          active:shadow-[0_4px_0_0_${colors.activeShadow}]
          active:from-[${colors.activeGradientFrom}]
          active:to-[${colors.activeGradientTo}]
          ${!disabled ? `group-hover:shadow-[0_0_0px_3px_${colors.hoverShadow}]` : ''}
          duration-300 ${className}
        `}
            >
                {!disabled && (
                    <div className="absolute top-0 left-0 w-full h-full animate-rotate-gradient opacity-0 duration-300" />
                )}
                <div className="flex justify-center items-center rounded-[40px] xs:rounded-[50px] h-full">
                    <span
                        style={spanStyle}
                        className={`
              relative z-10 h-full text-[16px] xs:text-[18px] font-[700]
              text-white px-[36px] py-[12px] xs:py-[18px] rounded-[40px] xs:rounded-[50px] cursor-pointer
              transition-all duration-300 group ${spanClass} ${colorScheme}
            `}
                    >
                        {!disabled && (
                            <span
                                style={innerDivStyle}
                                className={`
                hideable w-full h-full opacity-0 px-[36px] py-[17px] xs:py-[23px] absolute rounded-[40px] xs:rounded-[50px]
                top-0 left-0
                transition-all duration-300 group-hover:opacity-100
              `}
                            />
                        )}
                        {text}
                    </span>
                </div>
            </button>
        </div>
    );
};

export default MainBtn;