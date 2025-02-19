import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  type: "button" | "submit" | "reset"; //kegunaan tombol
  onClick?: () => void; //interaksi klik
  className?: string;
};

export const ButtonSuccess = ({
  children,
  type,
  onClick,
  className,
}: Props) => {
  return (
    <button
      className={`text-sm bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 font-bold ${className}`}
      type={type}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export const ButtonWarning = ({
  children,
  type,
  onClick,
  className,
}: Props) => {
  return (
    <button
      className={`text-sm bg-yellow-500 text-white rounded-md py-2 px-4 hover:bg-yellow-600 font-bold ${className}`}
      type={type}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export const ButtonDanger = ({ children, type, onClick, className }: Props) => {
  return (
    <button
      className={`text-sm bg-red-600 text-white rounded-md py-2 px-4 hover:bg-red-700 font-bold ${className}`}
      type={type}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};

export const ButtonInfo = ({ children, type, onClick, className }: Props) => {
  return (
    <button
      className={`text-sm bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 font-bold ${className}`}
      type={type}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      {children}
    </button>
  );
};


export const OutlineSuccess = ({ children, type, onClick, className }: Props) => {
    return (
      <button
        className={`text-sm border border-green-600 bg-black text-green-600 rounded-md py-2 px-4 hover:bg-slate-300 font-bold ${className}`}
        type={type}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </button>
    );
  };

export const OutlineDanger = ({ children, type, onClick, className }: Props) => {
    return (
      <button
        className={`text-sm border border-red-600 bg-black text-red-600 rounded-md py-2 px-4 hover:bg-slate-300 font-bold ${className}`}
        type={type}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </button>
    );
  };

  export const OutlineInfo = ({ children, type, onClick, className }: Props) => {
    return (
      <button
        className={`text-sm border border-blue-600 bg-black text-blue-600 rounded-md py-2 px-4 hover:bg-slate-300 font-bold ${className}`}
        type={type}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </button>
    );
  };

  export const ButtonPrimary = ({
    children,
    type,
    onClick,
    className,
  }: Props) => {
    return (
      <button
        className={`text-sm bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 font-bold ${className}`}
        type={type}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        {children}
      </button>
    );
  };