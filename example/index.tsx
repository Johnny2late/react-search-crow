import React, { useEffect, useRef, useState } from "react";

import { SearchCrow } from "../src/searchCrow";

import { onSearchCrow } from "../src/searchCrow/onSearchCrow";
import { Any } from "../src/searchCrow/types";

function App() {
  const crowRef = useRef<Any>(null);

  const [searchResults, setSearchResults] = useState<Any[]>([]);
  const [selectItem, setSelectItem] = useState<Any>(null);

  useEffect(() => {
    console.log(selectItem);
    console.log(searchResults);
  }, [searchResults, selectItem]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // function generateVeryLongArray(size: number) {
  //   const result: Any = []

  //   for (let i = 1; i <= size; i++) {
  //     result.push(i.toString())
  //   }

  //   return result
  // }

  const itemsHard = [
    { id: 1, value: 1, price: "2$" },
    { id: 2, value: "text 2", price: "3$" },
    {
      id: 3,
      value: "text 3",
      price: "4$",
      children: [{ id: 31, value: "text 2" }],
    },
    { id: 4, value: "text 4", price: "5$" },
    { id: 5, value: "text 5", price: "6$" },
    {
      id: 6,
      value: "text 6",
      price: "7$",
      children: [
        {
          id: 37,
          value: "text 37",
          children: [{ id: 399, value: "text 4" }],
        },
      ],
    },
    { id: 7, value: "text 7", price: "8$" },
    {
      id: 8,
      value: "text-8",
      price: "9$",
      children: [{ id: 39, value: 4 }],
    },
    { id: 9, value: "text 9", price: "10$" },
  ];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const itemsNumbers = [2, 2, 3, 4, 33, [333, [3]]]
  const itemsStrings = ["1", "text 1", "text", "text2", "text 3", ["tex1"]];

  console.log(onSearchCrow(itemsStrings, "3"));

  const separator = " - ";

  return (
    <div className="App">
      <SearchCrow
        ref={crowRef}
        // items={generateVeryLongArray(100000)}
        items={itemsHard}
        // items={itemsNumbers}
        // items={itemsStrings}
        excludesKeys={["id"]}
        keysShowValue={["value", "price"]}
        searchByKeyAfterSelect="value"
        separatorValue={separator}
        keyId="id"
        debounce={0}
        value={"text 4"}
        onBlur={() => console.log("blur")}
        onFocus={() => console.log("onFocus")}
        onSearchResults={(items) => setSearchResults(items)}
        onSelect={(item) => setSelectItem(item)}
        addClasses={{
          wrapper: selectItem ? "classWrapper--select" : "",
        }}
      >
        {/* {searchResults.length > 0 &&
          searchResults.map(el => (
            <div
              key={el.id}
              onClick={() => crowRef.current?.handleItem(el, `${el.value}${separator}${el.price}`)}
            >
              {el.value}{separator}{el.price}
            </div>
          ))} */}
      </SearchCrow>
    </div>
  );
}

export default App;
