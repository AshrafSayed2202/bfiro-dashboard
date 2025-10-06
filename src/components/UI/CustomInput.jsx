import { useEffect, useRef, useState } from "react";
function CustomInput({
    id,
    label,
    required,
    value,
    children,
    hideErrorMessage,
    inputClass,
    spanClass,
    hasError,
    divClass,
    type,
    className,
    custom,
    secondLabel,
    ...others
}) {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    const labelRef = useRef();
    const secondLabelRef = useRef();
    const [maskSize, setMaskSize] = useState("0px 0px");
    useEffect(() => {
        setMaskSize(labelRef.current?.offsetWidth + 10 + "px 35px");
    }, [labelRef.current]);
    return (
        <label htmlFor={id} className={`relative group ${className}`}>
            {label && !secondLabel && (
                <span
                    ref={labelRef}
                    className={`absolute top-0 left-5  px-2 bg-[#121212] text-[10px] xs:text-[14px] z-[2] ${spanClass ? spanClass : ""} `}
                >
                    {label} <span className="text-red-500 ">{required && "*"}</span>
                </span>
            )}
            {label && secondLabel && (
                <div
                    className={`flex justify-between items-center w-[calc(100%-40px)] absolute top-0 left-5 z-[2] text-[16px] ${spanClass ? spanClass : ""} `}
                >
                    <span
                        ref={labelRef}
                        className={`bg-[#121212] px-2 text-[10px] xs:text-[14px]`}
                    >
                        {label} <span className="text-red-500 ">{required && "*"}</span>
                    </span>
                    <span
                        ref={secondLabelRef}
                        className={`bg-[#121212] px-2 text-[10px] xs:text-[14px] cursor-pointer hover:underline`}
                    >
                        {secondLabel}{" "}
                        <span className="text-red-500 ">{required && "*"}</span>
                    </span>
                </div>
            )}
            <div
                className={`relative flex-1 w-full h-[56px] z-[1] mt-[11px] form-control ${divClass && divClass}`}
            >
                {custom ? (
                    <>
                        {children}
                        {hasError && hasError?.status && (
                            <div className="label absolute right-0 bottom-[-27px] !mt-1">
                                <span className="text-red-500 truncate label-text-alt text-nowrap whitespace-nowrap">
                                    {hasError?.message}
                                </span>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {children}
                        {type === "textarea" ? (
                            <textarea
                                value={value}
                                className={`invertedMaskInput font-[300] bg-transparent border-[2px] h-full p-[20px] transition-colors duration-300 group-hover:border-[#FFFFFF] focus:border-[#FFFFFF] rounded-[18px] border-[#424242] outline-none ${inputClass} ${hasError?.status && " !border-red-500 group-hover:!border-red-500 focus:!border-red-500"}`}
                                id={id}
                                required={required}
                                style={{
                                    direction: arabicPattern.test(value) ? "rtl" : "ltr",
                                    maskSize: maskSize,
                                }}
                                autoComplete="off"
                                {...others}
                            ></textarea>
                        ) : type == "checkbox" ? (
                            <input
                                type={type}
                                id={id}
                                value={value}
                                checked={value}
                                className={`checkbox dark:!border-[#777] border-gray-350 checked:border-[var(--main-color)]   [--chkfg:white] ${inputClass} disabled:checked:opacity-100`}
                                {...others}
                            />
                        ) : type == "phone" ? (
                            <>
                                <input
                                    type={type}
                                    id={id}
                                    value={value}
                                    style={{
                                        direction: arabicPattern.test(value) ? "rtl" : "ltr",
                                        maskSize: maskSize,
                                    }}
                                    autoComplete="off"
                                    className={`invertedMaskInput font-[300] bg-transparent border-[2px] h-full p-[20px] transition-colors duration-300 group-hover:border-[#FFFFFF] focus:border-[#FFFFFF] rounded-[18px] border-[#424242] outline-none ${inputClass} ${hasError?.status && " !border-red-500 group-hover:!border-red-500 focus:!border-red-500"}`}
                                    {...others}
                                    required={required}
                                />
                                {/* <div className="absolute z-[999] left-[20px] text-[16px] cursor-pointer text-[#424242] top-[50%] translate-y-[-50%]">
                  <SelectInput
                    value={"+20"}
                    noOptionsMessage={() => "No Numbers available"}
                    handleInput={() => {}}
                    isEditing={true}
                    inputName="phone"
                    manualSelections={manualSelections}
                  />
                </div> */}
                                {/* Here the dropdown list to change the country code and the flag of the country */}
                            </>
                        ) : (
                            <input
                                type={type}
                                id={id}
                                value={value}
                                style={{
                                    direction: arabicPattern.test(value) ? "rtl" : "ltr",
                                    maskSize: maskSize,
                                }}
                                autoComplete="off"
                                className={`invertedMaskInput font-[300] bg-transparent border-[2px] h-full p-[20px] transition-colors duration-300 group-hover:border-[#FFFFFF] focus:border-[#FFFFFF] rounded-[18px] border-[#424242] outline-none ${inputClass} ${hasError?.status && " !border-red-500 group-hover:!border-red-500 focus:!border-red-500"}`}
                                {...others}
                                required={required}
                            />
                        )}
                        {hasError?.status && !hideErrorMessage && (
                            <div className="label absolute  right-0 bottom-[-27px]">
                                <span className="text-red-500 truncate label-text-alt text-nowrap whitespace-nowrap">
                                    {hasError?.message}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </label>
    );
}

export default CustomInput;
