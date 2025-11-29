import { useEffect, useState } from "react";
import { InputAdornment, TextField, IconButton } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import type { ChangeEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useDebounce } from "../utils/helper";

interface SearchFieldProps extends Omit<TextFieldProps, "onChange" | "value"> {
  value?: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchField: React.FC<SearchFieldProps> = ({
  onChange,
  value = "",
  placeholder = "Search",
  ...rest
}) => {
  const [searchString, setSearchString] = useState(value);
  const debouncedValue = useDebounce(searchString, 500);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  useEffect(() => {
    if (!value) {
      clearSearch();
    }
  }, [value]);
  

  const clearSearch = () => {
    setSearchString("");
  };

  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={searchString}
      onChange={(e) => setSearchString(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: searchString ? (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              aria-label="Clear search"
              onClick={clearSearch}
            >
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      {...rest}
    />
  );
};

export default SearchField;
