import React from "react";
import "./App.css";

const App = () => {
  const [searchText, setSearchText] = React.useState("");
  const stories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: "Jordan Walke",
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: "Redux",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
    {
      title: "Redux 2",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 2,
    },
    {
      title: "Redux 3",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 3,
    },
    {
      title: "Redux 4",
      url: "https://redux.js.org/",
      author: "Dan Abramov, Andrew Clark",
      num_comments: 2,
      points: 5,
      objectID: 4,
    },
  ];

  const onSearchChange = (searchTerm) => {
    setSearchText(searchTerm);
  };
  const filteredList = stories.filter((item) => {
    return (
      (searchText != null &&
        item.title.toUpperCase().includes(searchText.toUpperCase())) ||
      searchText == null
    );
  });

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <Search searchText={searchText} onSearchChange={onSearchChange} />
      <hr />
      <List list={filteredList} />
    </div>
  );
};

const Search = ({ searchText, onSearchChange }) => {
  const onChange = (event) => {
    const searchTerm = event.target.value;
    onSearchChange(searchTerm);
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={onChange} />

      <p>
        Searching for <strong>{searchText}</strong>
      </p>
    </div>
  );
};

const List = ({ list }) => {
  return (
    <ul>
      {list.map((item) => (
        <ListItem item={item} key={item.objectID} />
      ))}
    </ul>
  );
};

const ListItem = ({ item }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span> {item.author}</span>
    <span> {item.num_comments}</span>
    <span> {item.points}</span>
  </li>
);

export default App;
