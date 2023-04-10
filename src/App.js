import React, { useEffect, useReducer, useState } from "react";
import "./App.css";

const actions = {
  stories: {
    STORIES_FETCH_SUCCESS: "STORIES_FETCH_SUCCESS",
    REMOVE_STORIES: "REMOVE_STORIES",
    STORIES_FETCH_INIT: "STORIES_FETCH_INIT",
    STORIES_FETCH_ERROR: "STORIES_FETCH_ERROR",
  },
};

const initialStoriesState = [
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
// Async fake fetch
const getAsyncStories = () =>
  new Promise((resolve, reject) => {
    setTimeout(
      () =>
        resolve({
          data: {
            stories: initialStoriesState,
          },
        }),
      2000
    );

    // setTimeout(reject, 2000);
  });

const storiesReducer = (state, action) => {
  console.log(
    "action: " + action.type + " payload: " + JSON.stringify(action.payload)
  );
  switch (action.type) {
    case actions.stories.STORIES_FETCH_SUCCESS:
      return {
        ...state,
        stories: action.payload,
        isLoading: false,
        isError: false,
      };
    case actions.stories.REMOVE_STORIES:
      return {
        ...state,
        stories: state.stories.filter(
          (story) => story.objectID !== action.payload.objectID
        ),
      };
    case actions.stories.STORIES_FETCH_INIT:
      return { ...state, isLoading: true, isError: false };
    case actions.stories.STORIES_FETCH_ERROR:
      return { ...state, isLoading: false, isError: true };
    default:
      throw new Error();
  }
};

// Custom hook
const useSemiPersistenState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
};

const App = () => {
  const [searchText, setSearchText] = useSemiPersistenState("searchText", "");
  const [storiesState, dispatchStories] = useReducer(storiesReducer, {
    stories: [],
    isLoading: false,
    isError: false,
  });
  const { stories, isError, isLoading } = storiesState;
  const handleRemoveStory = (item) =>
    dispatchStories({ type: actions.stories.REMOVE_STORIES, payload: item });
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

  useEffect(() => {
    dispatchStories({ type: actions.stories.STORIES_FETCH_INIT });
    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: actions.stories.STORIES_FETCH_SUCCESS,
          payload: result.data.stories,
        });
      })
      .catch((error) =>
        dispatchStories({
          type: actions.stories.STORIES_FETCH_ERROR,
        })
      );
  }, []);

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchText}
        onInputChange={onSearchChange}
      >
        <strong>Search</strong>
      </InputWithLabel>
      <hr />

      {isError && <p>Something went wrong...</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={filteredList} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const InputWithLabel = ({
  id,
  type = "text",
  value,
  onInputChange,
  children,
}) => {
  const onChange = (event) => {
    onInputChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor={id}>{children}</label>&nbsp;
      <input id={id} type={type} onChange={onChange} value={value} />
    </div>
  );
};

const List = ({ list, onRemoveItem }) => {
  return (
    <ul>
      {list.map((item) => (
        <ListItem key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
      ))}
    </ul>
  );
};

const ListItem = ({ item, onRemoveItem }) => (
  <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span> {item.author}</span>
    <span> {item.num_comments}</span>
    <span> {item.points} </span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

export default App;
