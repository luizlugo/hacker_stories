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
    onSearchChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={onChange} value={searchText} />

      <p>
        Searching for <strong>{searchText}</strong>
      </p>
    </div>
  );
};

const List = ({ list }) => {
  return (
    <ul>
      {list.map(({ objectID, ...item }) => (
        <ListItem key={objectID} {...item} />
      ))}
    </ul>
  );
};

const ListItem = ({ url, title, author, num_comments, points }) => (
  <li>
    <span>
      <a href={url}>{title}</a>
    </span>
    <span> {author}</span>
    <span> {num_comments}</span>
    <span> {points}</span>
  </li>
);

export default App;
