import { SetStateAction, SyntheticEvent } from 'react';
import Input from './input';

interface SearchFormProps {
  onSearch: (e: SyntheticEvent<HTMLFormElement>) => void;
  setSearchWord: (value: SetStateAction<string>) => void;
  searchWord: string;
}

export default function SearchForm({ onSearch, setSearchWord, searchWord }: SearchFormProps) {
  return (
    <form
      onSubmit={onSearch}
      className="relative mb-8 font-light flex items-center gap-2 pb-1 border-b border-[#9a9a9a] text-lg leading-tight text-[#eaeaea]"
    >
      <button type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
      <Input
        name="search"
        type="text"
        placeholder="search"
        css="border-none placeholder:font-bold bg-transparent"
        onChange={(e: SyntheticEvent<HTMLInputElement>) => {
          setSearchWord(e.currentTarget.value);
        }}
        value={searchWord}
      />
    </form>
  );
}
