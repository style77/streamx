import { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/User';

const UserContext = createContext({
    user: {} as User | null,
    register: async (username: string, email: string, password1: string, password2: string) => { },
    login: async (email: string, password: string) => { },
    logout: async () => { },
});

export function useUser() {
    return useContext(UserContext);
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);

    const fetchCurrentUser = async () => {
        const response = await fetch("/api/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return
        }

        const responseData = await response.json();
        return responseData.data;
    }

    // You can fetch user data and tokens from your API here
    useEffect(() => {
        fetchCurrentUser().then(
            (data) => {
                setUser(data)
            }
        )
    }, []);

    const register = async (username: string, email: string, password1: string, password2: string) => {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password1, password2 }),
        });

        const responseData = await response.json();

        if ("error" in responseData) {
            throw new Error(responseData.error);
        }

        setUser({
            ...responseData.user
        });

        return responseData;
    };

    const login = async (email: string, password: string) => {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const responseData = (await response.json()).data;

        if ("error" in responseData) {
            throw new Error(responseData.error);
        }



        setUser({
            ...responseData.user
        });

        return responseData;
    };

    const logout = async () => {
        const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();

        if ("error" in responseData) {
            throw new Error(responseData.error);
        }

        setUser(null);

        return responseData;
    };

    return (
        <UserContext.Provider value={{ user, register, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}