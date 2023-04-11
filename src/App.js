import React, { useCallback, useEffect, useReducer, useState } from "react";
import "./App.css";
import axios from "axios";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query='";
const actions = {
  stories: {
    STORIES_FETCH_SUCCESS: "STORIES_FETCH_SUCCESS",
    REMOVE_STORIES: "REMOVE_STORIES",
    STORIES_FETCH_INIT: "STORIES_FETCH_INIT",
    STORIES_FETCH_ERROR: "STORIES_FETCH_ERROR",
  },
};

const storiesReducer = (state, action) => {
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
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchText}`);
  const { stories, isError, isLoading } = storiesState;
  const handleRemoveStory = (item) =>
    dispatchStories({ type: actions.stories.REMOVE_STORIES, payload: item });
  const onInputChange = (searchTerm) => {
    setSearchText(searchTerm);
  };
  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchText}`);
  };
  const handleFetchStories = useCallback(() => {
    dispatchStories({ type: actions.stories.STORIES_FETCH_INIT });
    axios
      .get(url)
      // .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: actions.stories.STORIES_FETCH_SUCCESS,
          payload: result.data.hits,
        });
      });
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchText}
        onInputChange={onInputChange}
      >
        <strong>Search</strong>
      </InputWithLabel>

      <button type="button" disabled={!searchText} onClick={handleSearchSubmit}>
        Submit
      </button>
      <hr />

      {isError && <p>Something went wrong...</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories} onRemoveItem={handleRemoveStory} />
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
