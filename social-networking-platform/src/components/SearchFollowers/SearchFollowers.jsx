import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./style.css";

export default function SearchFollowers(props) {
  const { onChange } = props;
  return (
    <div className="LogoSearch">
      <div className="LogoInputSearch">
        <div className="s-icon">
          <AiOutlineSearch />
        </div>
        <input
          onChange={onChange}
          type="text"
          placeholder="Type username to search"
        />
      </div>
    </div>
  );
}
