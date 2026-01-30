import React, { forwardRef, useId } from "react";

// Định nghĩa các Props mở rộng từ thuộc tính mặc định của thẻ input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, containerClassName = "", className = "", id, ...props },
    ref,
  ) => {
    // Tự động tạo ID duy nhất nếu không truyền vào (tốt cho Accessibility)
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {/* Render Label nếu có */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={`
            px-3 py-2 bg-white border shadow-sm border-gray-300 
            placeholder-gray-400 focus:outline-none focus:border-blue-500 
            focus:ring-blue-500 block w-full rounded-md sm:text-sm focus:ring-1
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            }
            ${className}
          `}
          {...props}
        />

        {/* Render câu thông báo lỗi nếu có */}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  },
);

// Đặt tên hiển thị để dễ debug trong React DevTools
Input.displayName = "Input";

export default Input;
