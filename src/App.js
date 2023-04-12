import React, { useCallback, useEffect, useReducer, useState } from "react";
import styles from "./App.module.css";
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
  const handleSearchSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${searchText}`);
    event.preventDefault();
  };
  const handleFetchStories = useCallback(async () => {
    dispatchStories({ type: actions.stories.STORIES_FETCH_INIT });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: actions.stories.STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({
        type: actions.stories.STORIES_FETCH_ERROR,
      });
    }
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
      <SearchForm
        searchText={searchText}
        handleSearchSubmit={handleSearchSubmit}
        onInputChange={onInputChange}
      />

      {isError && <p>Something went wrong...</p>}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const SearchForm = ({ searchText, handleSearchSubmit, onInputChange }) => (
  <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
    <span>
      <InputWithLabel
        id="search"
        value={searchText}
        onInputChange={onInputChange}
      >
        <strong>Search</strong>
      </InputWithLabel>

      <button
        type="submit"
        disabled={!searchText}
        className={`${styles.button} ${styles.buttonLarge}`}
      >
        Submit
      </button>
    </span>
  </form>
);

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
      <label htmlFor={id} className={styles.label}>
        {children}
      </label>
      &nbsp;
      <input
        id={id}
        type={type}
        onChange={onChange}
        value={value}
        className={styles.input}
      />
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
  <li className={styles.item}>
    <span style={{ width: "40%" }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: "30%" }}> {item.author}</span>
    <span style={{ width: "10%" }}> {item.num_comments}</span>
    <span style={{ width: "10%" }}> {item.points} </span>
    <span style={{ width: "10%" }}>
      <button
        type="button"
        onClick={() => onRemoveItem(item)}
        className={`${styles.button} ${styles.buttonSmall}`}
      >
        Dismiss
      </button>
    </span>
  </li>
);

export default App;
