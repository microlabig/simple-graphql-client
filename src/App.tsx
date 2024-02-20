import { useEffect, useState } from "react";
import "./App.css";
import { GET_ALL_USERS, GET_ONE_USER } from "./query/user";
import { useMutation, useQuery } from "@apollo/client";
import { User } from "./types/user";
import { CREATE_USER } from "./mutations/user";

function App() {
  const { data, loading, error, refetch } = useQuery(
    GET_ALL_USERS
    //   {
    //   pollInterval: 500, // pooling
    // }
  );
  const { data: oneUser, loading: loadingOneUser } = useQuery(GET_ONE_USER, {
    variables: {
      id: 1,
    }
  });
  const [newUser] = useMutation(CREATE_USER);

  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);

  useEffect(() => {
    if (!loading) {
      setUsers(data.getAllUsers);
    }
  }, [data, loading]);

  console.log(oneUser);

  const addUser = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const { data } = await newUser({
        variables: {
          input: {
            username,
            age,
          },
        },
      });
      console.log(data);
      setUsername("");
      setAge(0);
    } catch (error) {
      console.error(error);
    }
  };

  const getAll = (e: React.MouseEvent) => {
    e.preventDefault();
    refetch();
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error</h1>;
  }

  return (
    <div>
      <form className="form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(+e.target.value)}
        />
        <div className="btns">
          <button onClick={addUser}>Создать</button>
          <button onClick={getAll}>Получить</button>
        </div>
      </form>

      <ul className="users">
        {users.map((user) => (
          <li key={user.id} className="user">
            [{user.id}]: {user.username} - {user.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
