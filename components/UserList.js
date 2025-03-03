import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../api/api'; // Імпортуємо функцію API-запиту

const UsersList: React.FC = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers().then(setUsers).catch(console.error);
    }, []);

    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>{user.name} - {user.email}</li>
                ))}
            </ul>
        </div>
    );
};

export default UsersList;
