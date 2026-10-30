import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  filled?: boolean;
}

export function HeartIcon({ size = 32, className = "", filled = false, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {filled ? (
        <path
          d="M24 41.5C23.2 41.5 22.4 41.2 21.8 40.6C12.8 32.5 7 27.2 4.4 22.4C1.5 17 2.3 10.6 6.3 6.6C10.3 2.6 16.7 2.6 20.7 6.6L24 9.9L27.3 6.6C31.3 2.6 37.7 2.6 41.7 6.6C45.7 10.6 46.5 17 43.6 22.4C41 27.2 35.2 32.5 26.2 40.6C25.6 41.2 24.8 41.5 24 41.5Z"
          fill="currentColor"
        />
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 41.5C23.2 41.5 22.4 41.2 21.8 40.6C12.8 32.5 7 27.2 4.4 22.4C1.5 17 2.3 10.6 6.3 6.6C10.3 2.6 16.7 2.6 20.7 6.6L24 9.9L27.3 6.6C31.3 2.6 37.7 2.6 41.7 6.6C45.7 10.6 46.5 17 43.6 22.4C41 27.2 35.2 32.5 26.2 40.6C25.6 41.2 24.8 41.5 24 41.5ZM24 13.8L21.9 11.7C19.1 8.9 14.5 8.9 11.7 11.7C8.9 14.5 8.9 19.1 11.7 21.9L24 34.2L36.3 21.9C39.1 19.1 39.1 14.5 36.3 11.7C33.5 8.9 28.9 8.9 26.1 11.7L24 13.8Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

export function CommentIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M24 4C13.5 4 5 11.8 5 21.5C5 26.7 7.5 31.4 11.7 34.6L10.2 41.8C10 42.6 10.7 43.3 11.5 43C16.3 41.2 20.5 38.6 23.9 38.9C24 38.9 24.1 38.9 24.2 38.9C34.7 38.9 43.2 31.1 43.2 21.4C43 11.8 34.5 4 24 4ZM16.5 24C15.1 24 14 22.9 14 21.5C14 20.1 15.1 19 16.5 19C17.9 19 19 20.1 19 21.5C19 22.9 17.9 24 16.5 24ZM24 24C22.6 24 21.5 22.9 21.5 21.5C21.5 20.1 22.6 19 24 19C25.4 19 26.5 20.1 26.5 21.5C26.5 22.9 25.4 24 24 24ZM31.5 24C30.1 24 29 22.9 29 21.5C29 20.1 30.1 19 31.5 19C32.9 19 34 20.1 34 21.5C34 22.9 32.9 24 31.5 24Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SaveIcon({ size = 32, className = "", filled = false, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {filled ? (
        <path
          d="M10 8C10 5.8 11.8 4 14 4H34C36.2 4 38 5.8 38 8V43.5C38 44.4 37 44.9 36.3 44.4L24 34.6L11.7 44.4C11 44.9 10 44.4 10 43.5V8Z"
          fill="currentColor"
        />
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14 4C11.8 4 10 5.8 10 8V43.5C10 44.4 11 44.9 11.7 44.4L24 34.6L36.3 44.4C37 44.9 38 44.4 38 43.5V8C38 5.8 36.2 4 34 4H14ZM14 8H34V39.5L24 31.5L14 39.5V8Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

export function ShareIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M31.2 8.3C30.6 7.7 29.5 8.1 29.5 9V17C17.8 17 9.5 23.8 6.5 35.3C6.2 36.4 7.6 37.1 8.3 36.2C13.2 29.9 19.5 27.6 29.5 27.6V35.6C29.5 36.5 30.6 36.9 31.2 36.3L44.5 22.8C45.2 22.1 45.2 21.1 44.5 20.4L31.2 8.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function RepostIcon({ size = 32, className = "", filled = false, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 14H34V20L44 11L34 2V8H8C6.9 8 6 8.9 6 10V22H10V14ZM38 34H14V28L4 37L14 46V40H40C41.1 40 42 39.1 42 38V26H38V34Z"
        fill={filled ? "#fe2c55" : "currentColor"}
      />
    </svg>
  );
}

export function HomeIcon({ size = 26, filled = false, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {filled ? (
        <path
          d="M24 3.5L4 19.8V42.5C4 43.6 4.9 44.5 6 44.5H18V30.5H30V44.5H42C43.1 44.5 44 43.6 44 42.5V19.8L24 3.5Z"
          fill="currentColor"
        />
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 3.5L4 19.8V42.5C4 43.6 4.9 44.5 6 44.5H42C43.1 44.5 44 43.6 44 42.5V19.8L24 3.5ZM8 21.6L24 8.6L40 21.6V40.5H34V26.5H14V40.5H8V21.6ZM18 40.5V30.5H30V40.5H18Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

export function TemanIcon({ size = 26, filled = false, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {filled ? (
        <path
          d="M18 19C21.9 19 25 15.9 25 12C25 8.1 21.9 5 18 5C14.1 5 11 8.1 11 12C11 15.9 14.1 19 18 19ZM32 21C35.3 21 38 18.3 38 15C38 11.7 35.3 9 32 9C28.7 9 26 11.7 26 15C26 18.3 28.7 21 32 21ZM6 38.5C6 33.2 11.4 29 18 29C24.6 29 30 33.2 30 38.5V42H6V38.5ZM33.5 30.5C33.1 30.5 32.7 30.5 32.2 30.6C34.5 32.5 36 35.3 36 38.5V42H44V38.5C44 34.3 39.5 30.5 33.5 30.5Z"
          fill="currentColor"
        />
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18 5C14.1 5 11 8.1 11 12C11 15.9 14.1 19 18 19C21.9 19 25 15.9 25 12C25 8.1 21.9 5 18 5ZM15 12C15 10.3 16.3 9 18 9C19.7 9 21 10.3 21 12C21 13.7 19.7 15 18 15C16.3 15 15 13.7 15 12ZM32 9C28.7 9 26 11.7 26 15C26 18.3 28.7 21 32 21C35.3 21 38 18.3 38 15C38 11.7 35.3 9 32 9ZM30 15C30 13.9 30.9 13 32 13C33.1 13 34 13.9 34 15C34 16.1 33.1 17 32 17C30.9 17 30 16.1 30 15ZM18 29C11.4 29 6 33.2 6 38.5V42H30V38.5C30 33.2 24.6 29 18 29ZM10 38C10.5 35 14 33 18 33C22 33 25.5 35 26 38H10ZM36 38.5C36 35.3 34.5 32.5 32.2 30.6C32.7 30.5 33.1 30.5 33.5 30.5C39.5 30.5 44 34.3 44 38.5V42H36V38.5Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

export function InboxIcon({ size = 26, filled = false, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {filled ? (
        <path
          d="M24 4C12.9 4 4 12.5 4 23C4 28.5 6.7 33.4 11 36.8L9.5 43.6C9.3 44.4 10.1 45.1 10.9 44.8L19.5 41.5C21 41.8 22.5 42 24 42C35.1 42 44 33.5 44 23C44 12.5 35.1 4 24 4ZM15 25C13.9 25 13 24.1 13 23C13 21.9 13.9 21 15 21C16.1 21 17 21.9 17 23C17 24.1 16.1 25 15 25ZM24 25C22.9 25 22 24.1 22 23C22 21.9 22.9 21 24 21C25.1 21 26 21.9 26 23C26 24.1 25.1 25 24 25ZM33 25C31.9 25 31 24.1 31 23C31 21.9 31.9 21 33 21C34.1 21 35 21.9 35 23C35 24.1 34.1 25 33 25Z"
          fill="currentColor"
        />
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 4C12.9 4 4 12.5 4 23C4 28.5 6.7 33.4 11 36.8L9.5 43.6C9.3 44.4 10.1 45.1 10.9 44.8L19.5 41.5C21 41.8 22.5 42 24 42C35.1 42 44 33.5 44 23C44 12.5 35.1 4 24 4ZM8 23C8 14.7 15.2 8 24 8C32.8 8 40 14.7 40 23C40 31.3 32.8 38 24 38C22.6 38 21.3 37.8 20 37.5L14 39.8L15.1 35C11 32.1 8 27.9 8 23ZM15 25C13.9 25 13 24.1 13 23C13 21.9 13.9 21 15 21C16.1 21 17 21.9 17 23C17 24.1 16.1 25 15 25ZM24 25C22.9 25 22 24.1 22 23C22 21.9 22.9 21 24 21C25.1 21 26 21.9 26 23C26 24.1 25.1 25 24 25ZM33 25C31.9 25 31 24.1 31 23C31 21.9 31.9 21 33 21C34.1 21 35 21.9 35 23C35 24.1 34.1 25 33 25Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

export function ProfileIcon({ size = 26, filled = false, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {filled ? (
        <path
          d="M24 23C29 23 33 19 33 14C33 9 29 5 24 5C19 5 15 9 15 14C15 19 19 23 24 23ZM8 42C8 34.3 15.2 28 24 28C32.8 28 40 34.3 40 42H8Z"
          fill="currentColor"
        />
      ) : (
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 5C19 5 15 9 15 14C15 19 19 23 24 23C29 23 33 19 33 14C33 9 29 5 24 5ZM19 14C19 11.2 21.2 9 24 9C26.8 9 29 11.2 29 14C29 16.8 26.8 19 24 19C21.2 19 19 16.8 19 14ZM24 28C15.2 28 8 34.3 8 42H12C12 36.5 17.4 32 24 32C30.6 32 36 36.5 36 42H40C40 34.3 32.8 28 24 28Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

export function LiveDot() {
  return (
    <div className="relative flex items-center justify-center w-6 h-6">
      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
    </div>
  );
}

export function SearchIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function MusicNoteIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

export function CreateButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Buat kenangan atau ajak kencan"
      className="relative flex items-center justify-center w-[44px] h-[30px] rounded-[8px] bg-white transition-transform active:scale-95"
    >
      {/* Cyan left offset */}
      <span className="absolute -left-[3px] top-0 bottom-0 w-[6px] bg-[#25f4ee] rounded-l-[8px] -z-10" />
      {/* Magenta right offset */}
      <span className="absolute -right-[3px] top-0 bottom-0 w-[6px] bg-[#fe2c55] rounded-r-[8px] -z-10" />
      {/* Black plus icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#000000"
        strokeWidth="3.2"
        strokeLinecap="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
}

